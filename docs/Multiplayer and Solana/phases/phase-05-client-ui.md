# Phase 05 - Client & UI

## Objective
Expose paid-match functionality through TypeScript SDKs and product UI without overwhelming free-match users.

## Current Baseline
- Existing TypeScript client + helper utilities assume free matches and do not surface balances or escrow data.
- No deposit dashboards or warnings about custody/KYC obligations.

## Deliverables
1. Updated client libraries (`packages/app`, SDK, Anchor wrappers) with methods:
   - `createPaidMatch`
   - `joinPaidMatch`
   - `depositToCustody`
   - `withdrawFromCustody`
   - `fetchLeaderboard` / `fetchMatchTranscript`
2. UI flows:
   - Match creation modal with entry-fee input, payment method toggle, warnings for KYC tiers.
   - Deposit management screen (balance, pending withdrawals, activity log).
   - In-match HUD showing current prize pool + platform fee breakdown.
   - Post-match screen summarizing payouts and next steps.
3. User education tooltips / banners summarizing custody selection.
4. Feature flags to progressively roll out paid matches per cohort.

## Implementation Checklist

**Phase Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

**⚠️ IMPORTANT:** If you encounter anything confusing, ambiguous, or unclear during implementation, STOP and ask the user (master) for clarification. Do not make assumptions.

### Deliverables Checklist
- [ ] Deliverable 1: Updated client libraries with paid-match methods
- [ ] Deliverable 2: UI flows (match creation modal, deposit management, in-match HUD, post-match screen)
- [ ] Deliverable 3: User education tooltips/banners
- [ ] Deliverable 4: Feature flags for progressive rollout

### Implementation Steps
- [ ] **Step 1:** Extend Anchor client config to load new IDL instructions, wrapping them in strongly typed helpers.
- [ ] **Step 2:** Update the UI store to track `custodyBalances`, `pendingWithdrawals`, `activeMatchType`, `entryFee`.
- [ ] **Step 3:** Build React components (or framework equivalent) for deposit balances and modals; wire to backend API endpoints coming in Phase 06.
- [ ] **Step 4:** Implement optimistic UI patterns using Durable Object mirror: fetch `PlayerShardDO` state via Worker for near-real-time updates.
- [ ] **Step 5:** Add localization-ready copy for compliance messaging; coordinate with legal on disclaimers.
- [ ] **Step 6:** Document UX flows in `docs/Multiplayer and Solana/ux-flows.md` with screenshots/wireframes (link to design tool if available).
- [ ] **Step 7:** **After ANY code change in this phase:** Run full test suite: `anchor build && anchor test && cargo check && cargo fmt && pnpm lint && pnpm test`. This ensures client + on-chain types stay in sync. Always check existing merged work for this phase before editing.
- [ ] **Step 8:** If client engineers need clarity on Solana interactions, point them to the Solana Expert MCP tools for authoritative guidance.

### Testing Checklist
- [ ] Unit test: Client helpers with mocked Anchor provider + Worker API
- [ ] Cypress/Playwright test: Deposit workflow end-to-end
- [ ] Cypress/Playwright test: Create paid match → join → withdraw winnings
- [ ] Visual regression test: Match creation modal

### Exit Criteria Checklist
- [ ] Client SDK exposes new APIs with typed docs
- [ ] UI designs approved and implemented behind feature flag
- [ ] Automated tests cover deposit workflow end-to-end
- [ ] All checkboxes above are checked ✅

## File & Module Impact
- `src/services/solana` (GameClient, AnchorClient, MatchCoordinator)
- `src/store` (or equivalent)
- `src/ui/components/paid-match` layouts
- `tests/ui` integration harness to call new client methods

## Testing & Validation
- Unit tests for client helpers mocking Anchor provider + Worker API.
- Cypress/Playwright flows for: deposit, create paid match, join, withdraw winnings.
- Visual regression tests on match creation modal.

## Risks & Mitigations
- **User confusion**: default to free matches, hide paid toggle until verified.
- **Balance desync**: rely on Durable Object mirror + manual refresh button.
- **Large numbers**: format lamports with separators, avoid floating conversions.

## Exit Criteria
- Client SDK exposes new APIs with typed docs.
- UI designs approved and implemented behind feature flag.
- Automated tests cover deposit workflow end-to-end.

## Related Docs
- `docs/money-match-plan/cloudflare-worker.md` for the HTTP endpoints and DO state this UI consumes.
- `docs/money-match-plan/cloudflare-db-schema.md` for persistence backing player balances and leaderboard queries.
- `docs/money-match-plan/architecture-diagram.md` to keep UX flows aligned with the overall system wiring.
