# Phase 10 - Expansion Tracks

## Objective
Coordinate the expansion tracks that build on the paid-match baseline once governance, economics, and monitoring are operational.

## Candidate Tracks
1. **SPL / USDC Support**
   - Add token agnostic escrow by introducing token accounts and token program CPIs.
   - Expand config account to map allowed mints, fee schedules per asset, and oracle-based USD equivalents.
2. **Tournament Mode**
   - Hierarchical match objects referencing tournament IDs, bracket management, scheduled payouts.
   - Payout batching instructions to distribute prizes across many winners efficiently.
3. **Admin Analytics Dashboard**
   - Real-time view of paid match funnel, per-game revenue, deposit vs withdrawal ratios.
   - Role-based access, export to CSV, integration with compliance workflows.
4. **Settlement Schedules**
   - Instead of instant withdrawals, introduce payout windows (daily, weekly) to simplify treasury ops.
   - On-chain schedule account with merkle proofs for batch payouts.
5. **DAO Governance**
   - Transition config management from multisig to DAO proposals (e.g., Realms or Squads + governance module).
   - Token-weighted voting on fee changes or new payment methods.
6. **Advanced Fraud Detection**
   - Machine-learning risk scoring using Firebase + off-chain data.
   - Adaptive withdrawal limits based on player history and dispute rate.
7. **Third-party Payment Integrations**
   - Support direct fiat purchases, alternative custodial wallets, or partner platforms.
8. **Rule Automation & Compliance APIs**
   - Provide API endpoints for regulators/auditors to query match economics with signed proofs.

## Planning Notes
- Treat each track as its own RFC referencing the baseline docs listed below.
- Re-validate legal/compliance requirements before enabling new custody regimes or tournament payouts.
- Keep shared WASM + Durable Object layers modular so token or tournament additions reuse existing reconciliation flows.
- Before starting any expansion track, review completed work in prior phases, run `anchor build`, `anchor test`, `cargo check`, `cargo fmt`, `pnpm lint`, and `pnpm test` so new ideas start from a green baseline; fix any lint/type regressions immediately.
- For Solana-specific questions during expansions, consult the Solana Expert MCP tools to avoid re-inventing answers.

## Exit Criteria
- Track charter, RFC, and resourcing completed for the expansion in scope.
- Dependencies on earlier phases documented and scheduled.
- Compliance/governance approvals captured so work can begin immediately.

## Related Docs
- `docs/money-match-plan/architecture.md` and `docs/money-match-plan/architecture-diagram.md` for the canonical baseline these tracks extend.
- `docs/money-match-plan/cloudflare-worker.md` for Worker responsibilities that expansion modules reuse.
- `docs/money-match-plan/solana-anchor-leaderboard-snapshots.md` and `docs/money-match-plan/leaderboard-anchor.md` for current on-chain patterns referenced by upcoming RFCs.

