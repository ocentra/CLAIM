# Phase 07 - Testing & CI

## Objective

Guarantee paid-flow reliability by expanding unit, integration, WASM parity, and CI pipelines.

## Current Baseline

- Anchor tests cover free match lifecycle only.
- TypeScript harness already supports tagging tests by cluster but lacks paid scenarios.
- CI runs anchor test plus worker build, but no WASM crate or security scans.

## Deliverables

1. Rust tests:
   - Unit tests for new instructions (deposit, withdraw, distribute, pause).
   - Flow tests: create paid match -> join -> end -> distribute.
   - Fuzz or property tests for fee math (use proptest or similar).
2. TypeScript tests:
   - Paid match lifecycle suites under `tests/common/lifecycle-paid/` and `tests/common/errors-paid/`.
   - Cloudflare Worker tests verifying Durable Object mirrors entry fee state.
3. WASM parity tests comparing outputs of shared fee module compiled native vs wasm32.
4. CI pipeline updates:
   - Build shared WASM crate, run wasm-bindgen tests.
   - Run Firebase emulator tests for backend functions.
   - Add security/static analysis (cargo audit, npm audit) gates.
   - Artifacts: Anchor IDL, test reports, coverage summaries.

## Implementation Checklist

**Phase Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

**⚠️ IMPORTANT:** If you encounter anything confusing, ambiguous, or unclear during implementation, STOP and ask the user (master) for clarification. Do not make assumptions.

### Deliverables Checklist
- [ ] Deliverable 1: Rust tests (unit, flow, fuzz/property tests)
- [ ] Deliverable 2: TypeScript tests (paid match lifecycle, Worker tests)
- [ ] Deliverable 3: WASM parity tests
- [ ] Deliverable 4: CI pipeline updates

### Implementation Steps
- [ ] **Step 1:** Extend `Anchor.toml` test scripts to set env vars for paid tests (e.g., `RUN_PAID_TESTS`).
- [ ] **Step 2:** Update `tests/root-hooks.ts` to detect whether paid match tests should run on devnet vs localnet (skip stress on devnet).
- [ ] **Step 3:** Build utilities to fund escrow PDA automatically within tests (airdrop to temp key, transfer to PDA).
- [ ] **Step 4:** Configure GitHub Actions (or CI of choice) to cache Rust, Node, and WASM build outputs to keep runtime manageable.
- [ ] **Step 5:** Add Codecov or similar coverage reporting for both Rust and TypeScript suites.
- [ ] **Step 6:** Extend shared fixtures under `test-data/` with any new paid-match or custodial scenarios so Anchor, Worker, and UI suites stay deterministic.
- [ ] **Step 7:** Document test matrix in `docs/Multiplayer and Solana/testing-matrix.md` (localnet vs devnet vs staging).
- [ ] **Step 8:** **After ANY code change in this phase:** Run full test suite: `anchor build && anchor test && cargo check && cargo fmt && pnpm lint && pnpm test`. This ensures all new test suites stay green and don't regress existing functionality.
- [ ] **Step 9:** When test harness work surfaces Solana-specific questions, use the Solana Expert MCP tools to confirm best practices.

### Testing Checklist
- [ ] Rust unit test: New instructions (deposit, withdraw, distribute, pause)
- [ ] Rust flow test: create paid match → join → end → distribute
- [ ] Rust fuzz/property test: Fee math correctness
- [ ] TypeScript test: Paid match lifecycle suites
- [ ] TypeScript test: Cloudflare Worker tests for DO mirrors
- [ ] WASM parity test: Shared fee module native vs wasm32 outputs

### Exit Criteria Checklist
- [ ] CI green path includes all new jobs
- [ ] Test suites for paid flows pass locally and on CI
- [ ] Documentation updated so contributors know how to run targeted suites
- [ ] All checkboxes above are checked ✅

## Risks & Mitigations

- **Long CI times**: parallelize jobs (Rust, TypeScript, Firebase) and use caching.
- **Flaky devnet tests**: default to localnet for heavy flows; run devnet nightly with retries.
- **WASM drift**: treat WASM outputs as golden vectors committed to repo for regression detection.

## Exit Criteria

- CI green path includes all new jobs.
- Test suites for paid flows pass locally and on CI.
- Documentation updated so contributors know how to run targeted suites.

## Related Docs

- `docs/money-match-plan/rfc-onchain-offchain-system.md` for the authoritative flow definitions test cases must cover.
- `docs/money-match-plan/cloudflare-worker.md` for Worker + DO behavior mocked in integration tests.
- `docs/money-match-plan/solana-anchor-leaderboard-snapshots.md` for on-chain snapshot validation vectors.
