# Phase 03 – Economic Instructions

## Objective
Implement deposit, withdraw, prize distribution, and escrow refund instructions that enable users to fund platform deposits and receive winnings from paid matches.

## Current Baseline
- `UserDepositAccount` and `EscrowAccount` structs exist (Phase 02) but have no instructions to interact with them.
- No SOL transfer logic exists for platform deposits or prize distribution.
- Match lifecycle instructions (Phase 04) will depend on these economic instructions.

## Deliverables
1. **`deposit_sol`** instruction: Transfer SOL from user wallet to `UserDepositAccount` (platform deposit).
2. **`withdraw_sol`** instruction: Transfer SOL from `UserDepositAccount` back to user wallet (with fee deduction).
3. **`distribute_prizes`** instruction: Distribute prize pool from `EscrowAccount` to winners after match ends.
4. **`refund_escrow`** instruction: Refund entry fees from `EscrowAccount` to players for cancelled matches.
   - **Includes industry-standard cancellation penalty system**: Abandoned players forfeit entry fee, platform receives cancellation fee + abandoned stake.
   - **See**: `docs/Multiplayer and Solana/match-cancellation-policy.md` for detailed policy, industry research, and implementation details.
5. **Fee calculations**: Platform fee deduction, withdrawal fee application, cancellation fee, treasury fee accumulation.

## Payment Method Constraints
- Platform deposits (`deposit_sol`) are required for platform-funded matches.
- Withdrawals (`withdraw_sol`) deduct withdrawal fees and respect lock periods.
- Prize distribution (`distribute_prizes`) only works after match ends and escrow is funded.
- Escrow refunds (`refund_escrow`) only work for cancelled matches before distribution.
  - **Cancellation Penalty System**: Abandoned players forfeit entry fee (prevents exploitation).
  - **See**: `docs/Multiplayer and Solana/match-cancellation-policy.md` for full policy details.

## Implementation Checklist

**Phase Status:** ✅ Complete

**⚠️ IMPORTANT:** If you encounter anything confusing, ambiguous, or unclear during implementation, STOP and ask the user (master) for clarification. Do not make assumptions.

### Deliverables Checklist
- [x] Deliverable 1: `deposit_sol` instruction implemented
- [x] Deliverable 2: `withdraw_sol` instruction implemented
- [x] Deliverable 3: `distribute_prizes` instruction implemented
- [x] Deliverable 4: `refund_escrow` instruction implemented
- [x] Deliverable 5: Fee calculations implemented correctly

### Implementation Steps
- [x] **Step 1:** Create `deposit_sol.rs` in `instructions/common/economic/`:
  - [x] Accounts: `UserDepositAccount` (mut), `user` (signer), `system_program`
  - [x] Transfer SOL from user to UserDepositAccount PDA
  - [x] Update `total_deposited` and `available_lamports`
  - [x] Validate account not frozen
- [x] **Step 2:** Create `withdraw_sol.rs` in `instructions/common/economic/`:
  - [x] Accounts: `UserDepositAccount` (mut), `user` (signer), `config_account`, `treasury` (optional), `system_program`
  - [x] Validate `available_lamports >= amount + withdrawal_fee`
  - [x] Validate `locked_until` timestamp (if locked)
  - [x] Deduct withdrawal fee, transfer to treasury
  - [x] Transfer remaining amount to user
  - [x] Update `available_lamports` and `withdrawn_lamports`
- [x] **Step 3:** Create `distribute_prizes.rs` in `instructions/common/economic/`:
  - [x] Accounts: `EscrowAccount` (mut), `Match` (mut), `config_account`, `treasury`, winners (multiple), `system_program`
  - [x] Validate match is ended (`phase == ENDED`)
  - [x] Validate escrow is funded and not already distributed
  - [x] Calculate platform fee, transfer to treasury
  - [x] Distribute prize pool to winners based on match results
  - [x] Mark escrow as distributed
- [x] **Step 4:** Create `refund_escrow.rs` in `instructions/common/economic/`:
  - [x] Accounts: `EscrowAccount` (mut), `Match` (mut), `config_account`, `treasury` (optional), players (multiple), `system_program`
  - [x] Validate match is cancelled or refundable
  - [x] Validate escrow not already distributed
  - [x] Implement cancellation penalty system (see `match-cancellation-policy.md`):
    - [x] Accept `cancellation_reason` and `abandoned_player_index` parameters
    - [x] If `PLAYER_ABANDONMENT/TIMEOUT/GRACE_PERIOD_EXPIRED`: Abandoned player forfeits entry fee
    - [x] If `PLATFORM_FAULT`: All players get full refunds, no platform fee
    - [x] Calculate and transfer cancellation fee + abandoned stake to treasury
  - [x] Refund entry fees to innocent players (wallet or platform deposit)
  - [x] Mark escrow as cancelled, store cancellation reason and abandoned player index
- [x] **Step 5:** Update `instructions/common/economic/mod.rs` to export new instructions.
- [x] **Step 6:** Update `instructions/mod.rs` to include economic instructions in program.
- [x] **Step 7:** **After ANY code change in this phase:** Run full test suite: `anchor build && anchor test && cargo check && cargo fmt && pnpm lint && pnpm test`. This ensures Rust, Anchor, and TypeScript code stays in sync and passes all checks.
- [x] **Step 8:** For Solana/Anchor questions during this phase, rely on the Solana Expert MCP tools (Solana Expert, Solana Docs Search, Anchor Expert) for authoritative answers.

### Testing Checklist
- [x] Anchor test: `deposit_sol` - Successfully deposit SOL to UserDepositAccount
- [x] Anchor test: `deposit_sol` - Fail if account is frozen
- [x] Anchor test: `withdraw_sol` - Successfully withdraw SOL with fee deduction
- [x] Anchor test: `withdraw_sol` - Fail if insufficient balance
- [x] Anchor test: `withdraw_sol` - Fail if account is locked
- [x] Anchor test: `distribute_prizes` - Successfully distribute prizes to winners
- [x] Anchor test: `distribute_prizes` - Fail if match not ended
- [x] Anchor test: `distribute_prizes` - Fail if already distributed
- [x] Anchor test: `refund_escrow` - Successfully refund cancelled match (all players)
- [x] Anchor test: `refund_escrow` - Player abandonment: Abandoned player forfeits entry fee
- [x] Anchor test: `refund_escrow` - Player abandonment: Innocent players get full refunds
- [x] Anchor test: `refund_escrow` - Player abandonment: Platform receives cancellation fee + abandoned stake
- [x] Anchor test: `refund_escrow` - Platform fault: All players get full refunds, no platform fee
- [x] Anchor test: `refund_escrow` - Fail if match not cancelled
- [ ] TypeScript integration test: Full flow deposit → join match → win → distribute prizes (see integration-tests-todo.md)

### Exit Criteria Checklist
- [x] All economic instructions implemented and tested
- [x] Fee calculations verified (platform fee, withdrawal fee, cancellation fee, treasury accumulation)
- [x] Cancellation penalty system implemented and tested (abandoned players forfeit entry fee)
- [x] All tests passing (Anchor build, anchor test, cargo check, cargo fmt, pnpm lint)
- [x] Documentation updated with instruction signatures and account requirements
- [x] Cancellation policy documented in `match-cancellation-policy.md`
- [x] All checkboxes above are checked ✅

## File & Module Impact
- New: `programs/ocentra-games/src/instructions/common/economic/deposit_sol.rs`
- New: `programs/ocentra-games/src/instructions/common/economic/withdraw_sol.rs`
- New: `programs/ocentra-games/src/instructions/common/economic/distribute_prizes.rs`
- New: `programs/ocentra-games/src/instructions/common/economic/refund_escrow.rs`
- Modified: `programs/ocentra-games/src/instructions/common/economic/mod.rs`
- Modified: `programs/ocentra-games/src/instructions/mod.rs`
- New: `tests/common/economic/` directory with test files

## Testing & Validation
- Anchor tests covering:
  - Deposit SOL to UserDepositAccount
  - Withdraw SOL with fee deduction
  - Distribute prizes to winners
  - Refund escrow for cancelled matches
- TypeScript integration tests for full economic flows.

## Risks & Mitigations
- **SOL transfer failures**: Use CPI (Cross-Program Invocation) with proper error handling.
- **Fee calculation errors**: Use checked arithmetic to prevent overflow.
- **Race conditions**: Ensure atomic updates to account balances.
- **Account freezing**: Validate account state before operations.

## Exit Criteria
- All economic instructions implemented and tested.
- Fee calculations verified and documented.
- All tests passing with no warnings.

## Related Docs
- `docs/Multiplayer and Solana/state-layouts.md` for account structures.
- `docs/Multiplayer and Solana/phases/phase-02-onchain-state.md` for state design.
- `docs/Multiplayer and Solana/phases/phase-04-match-lifecycle.md` for how these instructions integrate with match lifecycle.
- `docs/Multiplayer and Solana/match-cancellation-policy.md` for cancellation penalty system, industry research, and implementation details.

