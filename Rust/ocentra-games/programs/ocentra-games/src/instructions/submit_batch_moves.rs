use anchor_lang::prelude::*;
use crate::state::{Match, Move, GameRegistry};
use crate::validation;
use crate::error::GameError;

/// Move data for batch submission.
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct BatchMove {
    pub action_type: u8,
    pub payload: Vec<u8>,
    pub nonce: u64,
}

/// Submits up to 5 moves in a single transaction.
/// Per spec Section 16.6: Move batching for cost optimization (73% cost reduction).
/// 
/// **CRITICAL LIMITATIONS (Deadlock Prevention):**
/// - All moves must be from the same player AND only in their turn.
/// - Batch moves are ONLY allowed when it's the player's turn (current_player matches).
/// - This prevents deadlocks where multiple players try to batch moves simultaneously.
/// - Use case: Primarily for queuing multiple actions in a single turn (e.g., pick up + declare intent).
/// 
/// **NOTE:** This is NOT meant to batch moves across different players or different turns.
/// All moves in the batch must be valid for the current turn only - no turn advancement during batch.
pub fn handler(
    ctx: Context<SubmitBatchMoves>,
    match_id: String,
    user_id: String,  // Firebase UID (per spec: use user IDs, not Pubkeys)
    moves: Vec<BatchMove>,  // Up to 5 moves
) -> Result<()> {
    let mut match_account = ctx.accounts.match_account.load_mut()?;
    let registry = ctx.accounts.registry.load()?;
    let clock = Clock::get()?;
    
    // Validate batch size (up to 5 moves)
    require!(
        moves.len() > 0 && moves.len() <= 5,
        GameError::InvalidPayload
    );
    
    // Security: Validate player is signer
    require!(
        ctx.accounts.player.is_signer,
        GameError::Unauthorized
    );
    
    // Security: Validate match_id matches
    let match_id_bytes = match_id.as_bytes();
    require!(
        match_id_bytes.len() == 36 && 
        match_id_bytes == &match_account.match_id[..match_id_bytes.len().min(36)],
        GameError::InvalidPayload
    );
    
    // Security: Validate match is in playing phase
    require!(
        match_account.phase == 1,
        GameError::InvalidPhase
    );
    
    // Security: Validate match not ended
    require!(
        !match_account.is_ended(),
        GameError::MatchAlreadyEnded
    );
    
    // Security: Validate minimum players requirement
    require!(
        match_account.has_minimum_players(&registry)?,
        GameError::InsufficientPlayers
    );
    
    // Convert user_id String to fixed-size array
    let user_id_bytes = user_id.as_bytes();
    require!(
        user_id_bytes.len() <= 64,
        GameError::InvalidPayload
    );
    let mut user_id_array = [0u8; 64];
    let copy_len = user_id_bytes.len().min(64);
    user_id_array[..copy_len].copy_from_slice(&user_id_bytes[..copy_len]);
    
    // Security: Validate player is in match (find by user_id)
    let player_index = match_account.find_player_index(&user_id_array)
        .ok_or(GameError::PlayerNotInMatch)?;
    
    // CRITICAL: Deadlock prevention - ALL moves must be from the same player AND only in their turn
    // Validate it's the player's turn BEFORE processing any moves
    require!(
        match_account.current_player == player_index as u8,
        GameError::NotPlayerTurn
    );
    
    // Process each move in the batch
    // CRITICAL: All moves must be valid for the CURRENT turn only - no turn advancement during batch
    let mut current_move_index = match_account.move_count as u16;
    
    // Convert match_id to fixed array
    let mut match_id_array = [0u8; 36];
    let copy_len = match_id_bytes.len().min(36);
    match_id_array[..copy_len].copy_from_slice(&match_id_bytes[..copy_len]);
    
    for (batch_idx, batch_move) in moves.iter().enumerate() {
        require!(
            batch_idx < 5,
            GameError::InvalidPayload
        );
        // Get move account by index (avoid moving out of array)
        let move_account = match batch_idx {
            0 => &mut ctx.accounts.move_account_0,
            1 => &mut ctx.accounts.move_account_1,
            2 => &mut ctx.accounts.move_account_2,
            3 => &mut ctx.accounts.move_account_3,
            4 => &mut ctx.accounts.move_account_4,
            _ => return Err(GameError::InvalidPayload.into()),
        };
        // Security: Validate action_type bounds
        require!(
            batch_move.action_type <= 4,
            GameError::InvalidAction
        );
        
        // Security: Validate payload size
        require!(
            batch_move.payload.len() <= 128,
            GameError::InvalidPayload
        );
        
        // Security: Validate nonce (must be greater than last nonce)
        let last_nonce = match_account.get_last_nonce(player_index);
        require!(
            batch_move.nonce > last_nonce,
            GameError::InvalidNonce
        );
        
        // Update last nonce for this player
        match_account.set_last_nonce(player_index, batch_move.nonce);
        
        // Validate move legality (game-specific validation)
        validation::validate_move(&*match_account, &registry, player_index, batch_move.action_type, &batch_move.payload)?;
        
        // Per critique: Card state validation for moves that involve cards (rebuttal)
        if batch_move.action_type == 4 { // Rebuttal action
            validation::validate_card_hash(&*match_account, player_index, &batch_move.payload)?;
        }
        
        // Create move account
        move_account.match_id = match_id_array;
        move_account.player = ctx.accounts.player.key();
        move_account.move_index = current_move_index;
        move_account.action_type = batch_move.action_type;
        move_account.set_payload(&batch_move.payload)?;
        move_account.timestamp = clock.unix_timestamp as u32; // Convert i64 to u32
        
        // Update match state based on action type (same logic as submit_move)
        // CRITICAL: All state updates happen for the same player (player_index) - no turn advancement during batch
        match batch_move.action_type {
            2 => {
                // Declare intent: record the declared suit
                if batch_move.payload.len() >= 1 {
                    let suit = batch_move.payload[0];
                    require!(suit <= 3, GameError::InvalidPayload);
                    match_account.set_declared_suit(player_index, suit);
                }
            }
            0 => {
                // Pick up: clear floor card, update hand size
                // NOTE: Turn advancement happens AFTER all moves are processed
                match_account.set_floor_card_revealed(false);
                match_account.clear_floor_card_hash();
                let current_size = match_account.get_hand_size(player_index);
                match_account.set_hand_size(player_index, current_size.saturating_add(1));
            }
            1 => {
                // Decline: clear floor card
                // NOTE: Turn advancement happens AFTER all moves are processed
                match_account.set_floor_card_revealed(false);
            }
            3 => {
                // Call showdown: transition to ended phase
                match_account.phase = 2; // Ended
                match_account.ended_at = clock.unix_timestamp;
            }
            _ => {}
        }
        
        // Advance move index for next iteration
        current_move_index += 1;
    }
    
    // Update match state after all moves processed
    match_account.move_count = current_move_index;
    
    // CRITICAL: Turn advancement happens ONCE after all moves are processed
    // Only advance turn if the last move was a turn-based move (pick_up or decline)
    // This prevents deadlocks and ensures all moves in batch are from the same turn
    if let Some(last_move) = moves.last() {
        if last_move.action_type == 0 || last_move.action_type == 1 {
            // Pick up or decline: advance to next player
            let max_players = match_account.get_max_players(&registry)? as usize;
            let next_player = ((player_index + 1) % max_players) as u8;
            match_account.current_player = next_player;
        }
        // For other moves (declare intent, rebuttal, call showdown), turn doesn't advance
    }
    
    msg!("Batch moves submitted: match_id={}, count={}", match_id, moves.len());
    Ok(())
}

#[derive(Accounts)]
#[instruction(match_id: String)]
pub struct SubmitBatchMoves<'info> {
    #[account(
        mut,
        seeds = [b"m", &match_id.as_bytes()[..31.min(match_id.len())]],
        bump
    )]
    pub match_account: AccountLoader<'info, Match>,
    
    #[account(
        seeds = [b"game_registry"],
        bump
    )]
    pub registry: AccountLoader<'info, GameRegistry>,
    
    // Fixed array of up to 5 Move accounts (only initialize the ones we need)
    // Using init_if_needed to avoid errors if fewer than 5 moves
    #[account(
        init_if_needed,
        payer = player,
        space = Move::MAX_SIZE,
        seeds = [
            b"move",
            &match_id.as_bytes()[..31.min(match_id.len())],
            player.key().as_ref(),
            &0u32.to_le_bytes()
        ],
        bump
    )]
    pub move_account_0: Account<'info, Move>,
    
    #[account(
        init_if_needed,
        payer = player,
        space = Move::MAX_SIZE,
        seeds = [
            b"move",
            &match_id.as_bytes()[..31.min(match_id.len())],
            player.key().as_ref(),
            &1u32.to_le_bytes()
        ],
        bump
    )]
    pub move_account_1: Account<'info, Move>,
    
    #[account(
        init_if_needed,
        payer = player,
        space = Move::MAX_SIZE,
        seeds = [
            b"move",
            &match_id.as_bytes()[..31.min(match_id.len())],
            player.key().as_ref(),
            &2u32.to_le_bytes()
        ],
        bump
    )]
    pub move_account_2: Account<'info, Move>,
    
    #[account(
        init_if_needed,
        payer = player,
        space = Move::MAX_SIZE,
        seeds = [
            b"move",
            &match_id.as_bytes()[..31.min(match_id.len())],
            player.key().as_ref(),
            &3u32.to_le_bytes()
        ],
        bump
    )]
    pub move_account_3: Account<'info, Move>,
    
    #[account(
        init_if_needed,
        payer = player,
        space = Move::MAX_SIZE,
        seeds = [
            b"move",
            &match_id.as_bytes()[..31.min(match_id.len())],
            player.key().as_ref(),
            &4u32.to_le_bytes()
        ],
        bump
    )]
    pub move_account_4: Account<'info, Move>,
    
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

