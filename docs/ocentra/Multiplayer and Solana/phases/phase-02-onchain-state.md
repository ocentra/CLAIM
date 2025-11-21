# Phase 02 – On-chain State Design

## Objective
Extend account schemas to track paid-match metadata, escrow holdings, and user deposits while retaining zero-copy efficiency.

## Current Baseline
- `Match` zero-copy struct stores fixed-size identifiers, per-player hashes, and replay-protection nonces but has no entry fee or prize data.
- No dedicated escrow PDA; SOL never moves through the program today.
- `UserAccount` focuses on GP/AC/subscription balances, not custody deposits.

## Deliverables
1. Updated state structs with `entry_fee`, `prize_pool`, `match_type`, `payment_method`, `tournament_id` (optional) fields.
2. Escrow account PDA schema capturing per-player stakes, platform fee accumulator, treasury owed amount, and distribution status.
3. User deposit PDA (one per user) tracking `total_deposited`, `available`, `in_play`, `withdrawn`, `locked_until`.
4. Config account additions to enforce min/max entry fees, supported payment methods, and default fee schedule.
5. Size calculations + rent exemption table for each PDA, ensuring allocations fit within Solana limits (prefer < 1.2 KB per account).

## Payment Method Constraints
- All players in a match MUST use the same payment method
- `payment_method` is set at match creation and locked thereafter
- `join_match` instruction validates player's payment method matches match's `payment_method`
- Mixed-payment matches: NOT supported (rejected at join time with clear error message)

## Implementation Checklist

**Phase Status:** ✅ Complete

**⚠️ IMPORTANT:** If you encounter anything confusing, ambiguous, or unclear during implementation, STOP and ask the user (master) for clarification. Do not make assumptions.

### Deliverables Checklist
- [x] Deliverable 1: Updated state structs with `entry_fee`, `prize_pool`, `match_type`, `payment_method`, `tournament_id` fields
- [x] Deliverable 2: Escrow account PDA schema created
- [x] Deliverable 3: User deposit PDA created
- [x] Deliverable 4: Config account additions completed
- [x] Deliverable 5: Size calculations + rent exemption table documented

### Implementation Steps
- [x] **Step 1:** Define enum-like constants for `MatchType` (free, paid) and `PaymentMethod` (wallet, platform) in `state/match_state.rs` or a new `state/enums.rs` module.
- [x] **Step 2:** Append fixed-size fields to `Match` struct after existing fixed-length sections to maintain alignment. Keep arrays padded and update `MAX_SIZE`.
- [x] **Step 3:** Create `EscrowAccount` zero-copy struct under `state/escrow.rs` with:
  - [x] `match_pda`, `bump`
  - [x] `total_entry_lamports`, `platform_fee_lamports`, `payout_ready` flag
  - [x] `player_stakes: [u64; MAX_PLAYERS]`
  - [x] optional `reserved` bytes for future tokens (USDC, etc.)
- [x] **Step 4:** Create `UserDepositAccount` under `state/user_deposit.rs` with lamport counters + optional token mint metadata; ensure seeds include `user_authority` or `custody_delegate`.
- [x] **Step 5:** Update `state/config_account.rs` with deposit/withdraw fee values, treasury pubkeys, and `kyc_required_tier` thresholds for each payment method.
- [x] **Step 6:** Write constructor helpers in `state/mod.rs` to derive PDAs given match ID or user authority, keeping seeds consistent with forthcoming instructions.
- [x] **Step 7:** Document all struct layouts (offset tables, total bytes) in `docs/Multiplayer and Solana/state-layouts.md` for reference.
- [x] **Step 8:** **After ANY code change in this phase:** Run full test suite: `anchor build && anchor test && cargo check && cargo fmt && pnpm lint && pnpm test`. This ensures Rust, Anchor, and TypeScript code stays in sync and passes all checks.
- [x] **Step 9:** Stuck on Solana internals? Ask via the Solana Expert MCP tools (Solana Expert, Solana Docs Search, Anchor Expert) instead of guessing.

### Testing Checklist
- [x] Rust unit tests for `Match::MAX_SIZE` written and passing
- [x] Rust unit tests for `EscrowAccount::MAX_SIZE` written and passing
- [x] PDA seed derivations tested
- [x] Snapshot tests ensuring `bytemuck::bytes_of` round-trips for zero-copy structs
- [x] Anchor tests verifying rent exemption lamports computed during initialization are sufficient

### Exit Criteria Checklist
- [x] All new state structs committed with documented size math
- [x] Anchor build succeeds with no `accounts larger than 10kb` warnings
- [x] Tests cover PDA derivations and ensure new enums/flags default correctly
- [x] All checkboxes above are checked ✅

## File & Module Impact
- `programs/ocentra-games/src/state/match_state.rs`
- `programs/ocentra-games/src/state/config_account.rs`
- New: `programs/ocentra-games/src/state/escrow.rs`
- New: `programs/ocentra-games/src/state/user_deposit.rs`
- `state/mod.rs` re-export updates
- `docs/money-match-plan/state-layouts.md`

## Testing & Validation
- Rust unit tests for `Match::MAX_SIZE`, `EscrowAccount::MAX_SIZE`, and PDA seed derivations.
- Snapshot tests ensuring `bytemuck::bytes_of` round-trips for zero-copy structs.
- Anchor tests verifying rent exemption lamports computed during initialization are sufficient.

## Risks & Mitigations
- **Account size creep:** Keep arrays minimal; use packed bitfields for booleans and status flags.
- **Alignment bugs:** Continue explicit padding and run `bytemuck::Pod` assertions.
- **Future SPL tokens:** Reserve space for mint metadata now to avoid migrations.

## Exit Criteria
- All new state structs committed with documented size math.
- Anchor build succeeds with no `accounts larger than 10kb` warnings.
- Tests cover PDA derivations and ensure new enums/flags default correctly.

## Related Docs
- `docs/money-match-plan/architecture.md` for where escrow, deposits, and snapshots fit in the wider system.
- `docs/money-match-plan/leaderboard-anchor.md` and `docs/money-match-plan/solana-anchor-leaderboard-snapshots.md` for the on-chain accounts that will consume these state layouts.
- `docs/money-match-plan/cloudflare-worker.md` for how off-chain components expect to mirror these PDAs.
