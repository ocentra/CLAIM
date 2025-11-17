use crate::error::GameError;
use crate::state::ConfigAccount;
use anchor_lang::prelude::*;

/// Updates config parameters (fees, limits, treasury multisig).
/// Per Phase 01: Config update authority - treasury multisig.
/// Only the treasury multisig can call this instruction.
pub fn handler(
    ctx: Context<UpdateConfig>,
    platform_fee_bps: Option<u16>,
    withdrawal_fee_lamports: Option<u64>,
    min_entry_fee: Option<u64>,
    max_entry_fee: Option<u64>,
    treasury_multisig: Option<Pubkey>,
) -> Result<()> {
    let clock = Clock::get()?;
    let config = &mut ctx.accounts.config_account;

    // Validate authority is treasury multisig
    require!(
        ctx.accounts.authority.key() == config.treasury_multisig,
        GameError::Unauthorized
    );

    // Update platform_fee_bps if provided
    if let Some(fee_bps) = platform_fee_bps {
        require!(
            fee_bps <= 10000, // Max 100% (10000 bps)
            GameError::InvalidFeeParameter
        );
        config.platform_fee_bps = fee_bps;
    }

    // Update withdrawal_fee_lamports if provided
    if let Some(fee) = withdrawal_fee_lamports {
        // No upper bound check - platform can set any withdrawal fee
        config.withdrawal_fee_lamports = fee;
    }

    // Update min_entry_fee if provided
    if let Some(min_fee) = min_entry_fee {
        require!(
            min_fee > 0 && min_fee <= config.max_entry_fee,
            GameError::InvalidFeeParameter
        );
        config.min_entry_fee = min_fee;
    }

    // Update max_entry_fee if provided
    if let Some(max_fee) = max_entry_fee {
        require!(
            max_fee >= config.min_entry_fee,
            GameError::InvalidFeeParameter
        );
        config.max_entry_fee = max_fee;
    }

    // Update treasury_multisig if provided (for multisig rotation)
    if let Some(new_multisig) = treasury_multisig {
        config.treasury_multisig = new_multisig;
        msg!("Treasury multisig updated to: {}", new_multisig);
    }

    config.last_updated = clock.unix_timestamp;

    msg!(
        "Config updated by treasury multisig: {}",
        ctx.accounts.authority.key()
    );
    Ok(())
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(
        mut,
        seeds = [b"config_account"],
        bump
    )]
    pub config_account: Account<'info, ConfigAccount>,

    /// CHECK: Treasury multisig authority (must match config_account.treasury_multisig)
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}
