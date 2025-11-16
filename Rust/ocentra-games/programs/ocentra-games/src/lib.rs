use anchor_lang::prelude::*;

declare_id!("7eWx3H8bXMif7SDyPS1j5LZw1yUGDNZY592WzEKNf696");

pub mod state;
pub mod instructions;
pub mod error;

// Organized modules
pub mod common;
pub mod card_games;
pub mod games;

// Import instruction modules - Anchor's #[program] macro needs glob import to generate client code
// The ambiguous re-exports warning is acceptable because handlers use full paths
use instructions::*;

#[program]
pub mod ocentra_games {
    use super::*;

    pub fn create_match(
        ctx: Context<CreateMatch>,
        match_id: String,
        game_type: u8,
        seed: u64,
    ) -> Result<()> {
        instructions::games::match_lifecycle::create_match::handler(ctx, match_id, game_type, seed)
    }

    pub fn join_match(ctx: Context<JoinMatch>, match_id: String, user_id: String) -> Result<()> {
        instructions::games::match_lifecycle::join_match::handler(ctx, match_id, user_id)
    }

    pub fn start_match(ctx: Context<StartMatch>, match_id: String) -> Result<()> {
        instructions::games::match_lifecycle::start_match::handler(ctx, match_id)
    }

    pub fn commit_hand(
        ctx: Context<CommitHand>,
        match_id: String,
        user_id: String,
        hand_hash: [u8; 32],
        hand_size: u8,
    ) -> Result<()> {
        instructions::games::match_lifecycle::commit_hand::handler(ctx, match_id, user_id, hand_hash, hand_size)
    }

    pub fn submit_move(
        ctx: Context<SubmitMove>,
        match_id: String,
        user_id: String,
        action_type: u8,
        payload: Vec<u8>,
        nonce: u64,
    ) -> Result<()> {
        instructions::games::moves::submit_move::handler(ctx, match_id, user_id, action_type, payload, nonce)
    }

    pub fn end_match(
        ctx: Context<EndMatch>,
        match_id: String,
        match_hash: Option<[u8; 32]>,
        hot_url: Option<String>,
    ) -> Result<()> {
        instructions::games::match_lifecycle::end_match::handler(ctx, match_id, match_hash, hot_url)
    }

    pub fn anchor_match_record(
        ctx: Context<AnchorMatchRecord>,
        match_id: String,
        match_hash: [u8; 32],
        hot_url: Option<String>,
    ) -> Result<()> {
        instructions::games::match_lifecycle::anchor_match_record::handler(ctx, match_id, match_hash, hot_url)
    }

    pub fn register_signer(
        ctx: Context<RegisterSigner>,
        pubkey: Pubkey,
        role: u8,
    ) -> Result<()> {
        instructions::common::signers::register_signer::handler(ctx, pubkey, role)
    }

    pub fn anchor_batch(
        ctx: Context<AnchorBatch>,
        batch_id: String,
        merkle_root: [u8; 32],
        count: u64,
        first_match_id: String,
        last_match_id: String,
    ) -> Result<()> {
        instructions::common::batches::anchor_batch::handler(ctx, batch_id, merkle_root, count, first_match_id, last_match_id)
    }

    pub fn flag_dispute(
        ctx: Context<FlagDispute>,
        match_id: String,
        user_id: String,
        reason: u8,
        evidence_hash: [u8; 32],
        gp_deposit: u32,
    ) -> Result<()> {
        instructions::common::disputes::flag_dispute::handler(ctx, match_id, user_id, reason, evidence_hash, gp_deposit as u16)
    }

    pub fn resolve_dispute(
        ctx: Context<ResolveDispute>,
        dispute_id: String,
        resolution: u8,
    ) -> Result<()> {
        instructions::common::disputes::resolve_dispute::handler(ctx, dispute_id, resolution)
    }

    pub fn close_match_account(
        ctx: Context<CloseMatchAccount>,
        match_id: String,
    ) -> Result<()> {
        instructions::common::accounts::close_match_account::handler(ctx, match_id)
    }

    pub fn slash_validator(
        ctx: Context<SlashValidator>,
        validator_pubkey: Pubkey,
        amount: u64,
        reason: u8,
    ) -> Result<()> {
        instructions::common::validators::slash_validator::handler(ctx, validator_pubkey, amount, reason)
    }

    pub fn claim_daily_login(
        ctx: Context<ClaimDailyLogin>,
        user_id: String,
    ) -> Result<()> {
        instructions::common::economic::daily_login::handler(ctx, user_id)
    }

    pub fn start_game_with_gp(
        ctx: Context<StartGameWithGP>,
        match_id: String,
        user_id: String,
    ) -> Result<()> {
        instructions::common::economic::game_payment::handler(ctx, match_id, user_id)
    }

    pub fn claim_ad_reward(
        ctx: Context<ClaimAdReward>,
        user_id: String,
        ad_verification_signature: Vec<u8>,
    ) -> Result<()> {
        instructions::common::economic::ad_reward::handler(ctx, user_id, ad_verification_signature)
    }

    pub fn purchase_subscription(
        ctx: Context<PurchaseSubscription>,
        user_id: String,
        tier: u8,
        duration_days: u8,
    ) -> Result<()> {
        instructions::common::economic::pro_subscription::handler(ctx, user_id, tier, duration_days)
    }

    pub fn purchase_ai_credits(
        ctx: Context<PurchaseAICredits>,
        user_id: String,
        ac_amount: u64,
    ) -> Result<()> {
        instructions::common::economic::ai_credit_purchase::handler(ctx, user_id, ac_amount)
    }

    pub fn consume_ai_credits(
        ctx: Context<ConsumeAICredits>,
        user_id: String,
        model_id: u8,
        tokens_used: u32,
    ) -> Result<()> {
        instructions::common::economic::ai_credit_consume::handler(ctx, user_id, model_id, tokens_used)
    }

    pub fn initialize_registry(
        ctx: Context<InitializeRegistry>,
    ) -> Result<()> {
        instructions::common::registry::initialize_registry::handler(ctx)
    }

    pub fn register_game(
        ctx: Context<RegisterGame>,
        game_id: u8,
        name: String,
        min_players: u8,
        max_players: u8,
        rule_engine_url: String,
        version: u8,
    ) -> Result<()> {
        instructions::common::registry::register_game::handler(ctx, game_id, name, min_players, max_players, rule_engine_url, version)
    }

    pub fn update_game(
        ctx: Context<UpdateGame>,
        game_id: u8,
        name: Option<String>,
        min_players: Option<u8>,
        max_players: Option<u8>,
        rule_engine_url: Option<String>,
        version: Option<u8>,
        enabled: Option<bool>,
    ) -> Result<()> {
        instructions::common::registry::update_game::handler(ctx, game_id, name, min_players, max_players, rule_engine_url, version, enabled)
    }

    pub fn submit_batch_moves(
        ctx: Context<SubmitBatchMoves>,
        match_id: String,
        user_id: String,
        moves: Vec<BatchMove>,
    ) -> Result<()> {
        instructions::games::moves::submit_batch_moves::handler(ctx, match_id, user_id, moves)
    }
}
