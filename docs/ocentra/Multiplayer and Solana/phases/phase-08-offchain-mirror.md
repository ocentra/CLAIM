# Phase 08 - Off-chain Mirror & WASM

## Objective
Mirror paid-match economic state off-chain using Cloudflare Durable Objects and a shared Rust WASM crate to ensure UI responsiveness and resilience during Solana outages.

**State Authority:** On-chain (Solana) is primary source of truth when available. Off-chain (Durable Objects) serves as temporary fallback when Solana RPC is unavailable or degraded. See [`decisions.md`](../decisions.md) ADR-001 for full state authority rules.

> **CRITICAL: This phase starts ONLY after all on-chain phases (01-04) are complete.** The off-chain mirror depends on the on-chain state structs, escrow accounts, and match lifecycle instructions being fully implemented and tested first.

> **Status:** None of the off-chain mirror described here exists yet. When you build this phase, implement the entire baseline (session handling, escrow mirroring, fraud checks, queueing, reconciliation) before layering any optional money-match features.

## Current Baseline
- `MatchCoordinatorDO` tracks match metadata but not escrow balances or fee breakdowns.
- No dedicated Rust WASM crate; fee logic lives only on-chain (after this project it must be shared).
- No reconciliation jobs between on-chain events and Durable Object snapshots.

## Deliverables
1. Rust crate `shared/money-match-core` compiling for `wasm32-unknown-unknown` containing:
   - Fee calculation and prize split logic.
   - Serializers for `FeeBreakdown`, `PrizeDistribution`, `MatchStateSnapshot`.
   - Deterministic hash utilities shared with Durable Objects.
2. Cloudflare Durable Objects:
   - `MoneyMatchStateDO`: extends existing match coordinator to store escrow totals, pending payouts, user deposit mirrors, and idempotency keys.
   - `UserDepositDO`: per-user DO that maintains off-chain balance view, pending withdrawals, and backpressure queue when Solana RPC unavailable.
3. Services / Workers:
   - `StateSyncService` scheduled worker to reconcile on-chain events with DO state, detect mismatches, and emit alerts.
   - `SolanaHealthMonitor` that checks RPC latency, toggles degraded mode, and instructs DOs to queue actions when offline.
4. Fallback handling: queue join/end requests when Solana offline, replay with idempotency once network recovers.

## Implementation Checklist

**Phase Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

**⚠️ IMPORTANT:** If you encounter anything confusing, ambiguous, or unclear during implementation, STOP and ask the user (master) for clarification. Do not make assumptions.

### Deliverables Checklist
- [ ] Deliverable 1: Rust crate `shared/money-match-core` compiling for `wasm32-unknown-unknown`
- [ ] Deliverable 2: Cloudflare Durable Objects (`MoneyMatchStateDO`, `UserDepositDO`)
- [ ] Deliverable 3: Services/Workers (`StateSyncService`, `SolanaHealthMonitor`)
- [ ] Deliverable 4: Fallback handling with queueing and replay

### Implementation Steps
- [ ] **Step 1:** Scaffold the Rust crate with feature flags for `wasm` vs `native`, add tests verifying identical outputs across targets.
- [ ] **Step 2:** Use `wasm-bindgen` to expose functions consumed by Durable Objects; bundle via `wasm-pack` in Cloudflare build.
- [ ] **Step 3:** Extend `MatchCoordinatorDO` to persist escrow info inside SQLite storage; add websocket payloads broadcasting prize pool updates.
- [ ] **Step 4:** Build `UserDepositDO` methods: `credit`, `debit`, `hold`, `release`, each validating idempotency tokens to avoid double application.
- [ ] **Step 5:** Implement reconciliation worker that reads Solana confirmed transactions (via RPC or webhook) and compares to DO state; mismatches trigger pause + alert.
- [ ] **Step 6:** Define queueing format (e.g., `PendingAction` JSON with signature, seeds, and deterministic hash) so actions can be replayed safely.
- [ ] **Step 7:** **After ANY code change in this phase:** Run full test suite: `anchor build && anchor test && cargo check && cargo fmt && pnpm lint && pnpm test`. This ensures WASM + DO code, Rust crates, and Anchor programs stay clean; fix any lint/type issues introduced in this phase.
- [ ] **Step 8:** Reference the Solana Expert MCP tools whenever you hit Solana/Anchor design questions while wiring the mirror to on-chain programs.

### Testing Checklist
- [ ] Rust test: WASM vs native outputs are identical
- [ ] Cloudflare integration test: Simulate Durable Objects and outage scenarios using `miniflare`
- [ ] End-to-end test: Create paid match while forcing RPC outage, ensure DO queues join and replays once RPC returns

### Exit Criteria Checklist
- [ ] WASM crate published (or vendored) with documentation on how to consume
- [ ] Durable Objects store escrow + deposit mirrors and expose APIs for client fetches
- [ ] Reconciliation worker running in staging with alerting hooks configured
- [ ] All checkboxes above are checked ✅

## File & Module Impact
- `shared/money-match-core/` (new Cargo crate + wasm build tooling)
- `infra/cloudflare/src/durable-objects/MoneyMatchStateDO.ts` (existing) plus `UserDepositDO.ts`
- `infra/cloudflare/src/services/state-sync.ts`, `solana-health-monitor.ts`
- Worker build scripts (`package.json`, `tsconfig.json`, `wrangler.toml`) to include WASM bundle
- Documentation `docs/money-match-plan/offchain-mirror.md`

## Testing & Validation
- Rust tests comparing WASM vs native outputs.
- Cloudflare integration tests using `miniflare` to simulate Durable Objects and outage scenarios.
- End-to-end test: create paid match while forcing RPC outage, ensure DO queues join and replays once RPC returns.

## Risks & Mitigations
- **WASM bundle size**: keep crate focused on math/serialization; avoid pulling Anchor crates.
- **Consistency drift**: reconciliation service should mark matches as paused and notify operators when mismatches exceed threshold.
- **Queue overflow**: set limits per user and fall back to manual review when threshold exceeded.

## Exit Criteria
- WASM crate published (or vendored) with documentation on how to consume.
- Durable Objects store escrow + deposit mirrors and expose APIs for client fetches.
- Reconciliation worker running in staging with alerting hooks configured.

## Related Docs
- `docs/money-match-plan/cloudflare-worker.md` for DO responsibilities and APIs this mirror extends.
- `docs/money-match-plan/cloudflare-db-schema.md` for the persistent schema backing DO flushes.
- `docs/money-match-plan/architecture.md` and `docs/money-match-plan/architecture-diagram.md` for the dual-path context that guides fallback handling.

