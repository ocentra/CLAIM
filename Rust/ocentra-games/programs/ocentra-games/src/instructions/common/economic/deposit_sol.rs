use crate::error::GameError;
use crate::state::UserDepositAccount;
use anchor_lang::prelude::*;

/// Deposits SOL from user wallet to UserDepositAccount (platform deposit).
/// Per Phase 03: Economic instructions for platform deposits.
/// This enables users to fund their platform deposit account for platform-funded matches.
pub fn handler(ctx: Context<DepositSol>, amount: u64) -> Result<()> {
    // Validate amount is greater than zero
    require!(amount > 0, GameError::InvalidPayload);

    // 1. Perform the CPI transfer first. This will fund the PDA.
    // We do this BEFORE loading the account to avoid borrow conflicts.
    let cpi_accounts = anchor_lang::system_program::Transfer {
        from: ctx.accounts.user.to_account_info(),
        to: ctx.accounts.user_deposit_account.to_account_info(),
    };
    let cpi_program = ctx.accounts.system_program.to_account_info();
    let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
    anchor_lang::system_program::transfer(cpi_ctx, amount)?;

    // 2. Now, load the account to initialize or update its state.
    let mut deposit_account = match ctx.accounts.user_deposit_account.load_mut() {
        Ok(account) => {
            // If account is already initialized, validate authority and frozen status
            require!(
                account.authority == ctx.accounts.user.key(),
                GameError::Unauthorized
            );
            require!(!account.is_frozen(), GameError::AccountFrozen);
            account
        }
        Err(_) => {
            // If account is not initialized, load_init will set the discriminator
            let mut account = ctx.accounts.user_deposit_account.load_init()?;
            account.authority = ctx.accounts.user.key();
            account.bump = ctx.bumps.user_deposit_account;
            account.total_deposited = 0;
            account.available_lamports = 0;
            account.in_play_lamports = 0;
            account.withdrawn_lamports = 0;
            account.locked_until = 0;
            account.flags = 0;
            account
        }
    };

    // 3. Update the account's internal balance tracking
    deposit_account.total_deposited = deposit_account
        .total_deposited
        .checked_add(amount)
        .ok_or(GameError::Overflow)?;
    deposit_account.available_lamports = deposit_account
        .available_lamports
        .checked_add(amount)
        .ok_or(GameError::Overflow)?;

    msg!(
        "Deposited {} lamports to UserDepositAccount. Total deposited: {}, Available: {}",
        amount,
        deposit_account.total_deposited,
        deposit_account.available_lamports
    );

    Ok(())
}

#[derive(Accounts)]
pub struct DepositSol<'info> {
    #[account(
        init_if_needed,
        payer = user,
        space = UserDepositAccount::MAX_SIZE,
        seeds = [b"user_deposit", user.key().as_ref()],
        bump
    )]
    pub user_deposit_account: AccountLoader<'info, UserDepositAccount>,

    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
}
