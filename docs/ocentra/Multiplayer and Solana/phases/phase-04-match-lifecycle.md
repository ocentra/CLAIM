# Phase 04 - Match Lifecycle Updates

## Objective
Integrate paid-match economics into existing create/join/start/end instructions without breaking free matches.

## Current Baseline
- Lifecycle handlers under the on-chain match instruction module assume free play.
- Match accounts lack entry fee enforcement, escrow PDAs are never created, and the start instruction only validates capacity.

## Deliverables
1. Updated `create_match` handler accepting `entry_fee`, `payment_method`, `match_type`, `tournament_id` (optional) and initializing escrow if required.
2. `join_match` logic that transfers funds based on payment method:
   - Wallet-funded: CPI from player to escrow PDA.
   - Platform-funded: deduct from `UserDepositAccount` and transfer from platform custody to escrow.
   - **Payment method validation:** Reject join if player's payment method doesn't match match's `payment_method`.
3. `start_match` guard that verifies total escrow equals expected prize pool and that KYC tier requirements met.
4. `end_match` integration with prize distribution instruction + optional refunds for cancelled matches.
5. Backward-compatible path where `match_type = Free` short-circuits all paid logic.

## Payment Method Constraints
- All players in a match MUST use the same payment method
- `payment_method` is set at match creation and locked thereafter
- `join_match` instruction validates player's payment method matches match's `payment_method`
- Mixed-payment matches: NOT supported (rejected at join time with clear error message)

## Implementation Checklist

**Phase Status:** ✅ Complete

**⚠️ IMPORTANT:** If you encounter anything confusing, ambiguous, or unclear during implementation, STOP and ask the user (master) for clarification. Do not make assumptions.

### Deliverables Checklist
- [x] Deliverable 1: Updated `create_match` handler with entry_fee, payment_method, match_type, tournament_id
- [x] Deliverable 2: `join_match` logic with payment method validation and fund transfers
- [x] Deliverable 3: `start_match` guard with escrow verification and KYC checks
- [x] Deliverable 4: `end_match` integration with prize distribution
- [x] Deliverable 5: Backward-compatible path for free matches

### Implementation Steps
- [x] **Step 1:** Extend instruction account structs to include optional escrow PDA, user deposit PDA, platform authority, and config account.
- [x] **Step 2:** Update PDA derivation helpers shared with tests (TypeScript) so they know about escrow seeds.
- [x] **Step 3:** Introduce validation helper `assert_paid_match_requirements` in `match_lifecycle.rs` to reuse across handlers.
- [x] **Step 4:** Ensure `start_match` enforces `match_type == Paid` when `entry_fee > 0`.
- [x] **Step 5:** Propagate new fields through TypeScript helpers (`createPaidMatch`, SDK clients in Phase 05).
- [x] **Step 6:** Document seed + field expectations in `docs/Multiplayer and Solana/state-layouts.md` for implementers.
- [x] **Step 7:** **After ANY code change in this phase:** Run full test suite: `anchor build && anchor test && cargo check && cargo fmt && pnpm lint && pnpm test`. This ensures Rust, Anchor, and TypeScript code stays in sync and passes all checks.
- [x] **Step 8:** For Solana/Anchor questions during this phase, rely on the Solana Expert MCP tools (Solana Expert, Solana Docs Search, Anchor Expert) for authoritative answers.
- [x] **Step 9:** Add `is_paused` enforcement checks to all paid-match instructions (`create_match`, `join_match`, `deposit_sol`, `withdraw_sol`, `distribute_prizes`, `refund_escrow`). Tests must ensure config is unpaused before running paid-match operations (see `docs/compliance/treasury.md` for pause mechanism details).

### Testing Checklist
- [x] Anchor test: Free match unaffected
- [x] Anchor test: Wallet-funded match join with insufficient SOL → error
- [x] Anchor test: Platform-funded match join with insufficient deposit → error
- [x] Anchor test: Cancelled match refunds escrow to players
- [x] TypeScript integration test: create → join → start → end for wallet payment method
- [x] TypeScript integration test: create → join → start → end for platform payment method

### Exit Criteria Checklist
- [x] Lifecycle instructions merged with updated IDL; tests passing
- [x] Documentation states which accounts/signers are required per payment method
- [ ] Localnet scenario script demonstrating both flows shared in docs (see integration-tests-todo.md)
- [x] All checkboxes above are checked ✅

## File & Module Impact
- `programs/ocentra-games/src/instructions/match_lifecycle.rs`
- `programs/ocentra-games/src/state/escrow.rs`, `state/user_deposit.rs`, `state/config_account.rs`
- TypeScript helpers under `tests/utils/matchClient.ts`
- `docs/money-match-plan/state-layouts.md` new scenarios describing paid matches

## Testing & Validation
- Anchor tests covering:
   - Free match unaffected
   - Wallet-funded match join with insufficient SOL → error
   - Platform-funded match join with insufficient deposit → error
   - Cancelled match refunds escrow to players
- TypeScript integration tests walking create → join → start → end for both payment methods.

## Risks & Mitigations
- **Instruction size growth**: use structs with optional accounts but keep order consistent; consider separate instructions if needed.
- **Race conditions**: ensure `join_match` increments player count only after funds succeed.
- **Backward compatibility**: default `match_type` to free when omitted; tests must cover old clients until SDK updated.

## Exit Criteria
- Lifecycle instructions merged with updated IDL; tests passing.
- Documentation states which accounts/signers are required per payment method.
- Localnet scenario script demonstrating both flows shared in docs.

## Related Docs
- `docs/money-match-plan/architecture.md` for the dual on/off-chain flow this phase plugs into.
- `docs/money-match-plan/cloudflare-worker.md` for how Worker routes match creation/join to on-chain instructions.
- `docs/money-match-plan/leaderboard-anchor.md` and `docs/money-match-plan/solana-anchor-leaderboard-snapshots.md` for downstream snapshot expectations once matches finalize.
