# Phase 09 - Monitoring & Operations

## Objective

Provide observability, alerting, and runbooks so paid matches can run safely in production and operators can react quickly to anomalies.

## Current Baseline

- Cloudflare Worker exposes `/api/metrics` but limited to generic counters.
- No dedicated dashboards for economic volume, deposit balances, or fraud signals.
- Runbooks for Solana outages and fraud investigations are undocumented.

## Deliverables

1. Metrics plan covering:
   - On-chain: transaction failures, compute unit usage, escrow balances, prize payouts, paused matches.
   - Off-chain: Durable Object queue depth, reconciliation lag, Stripe webhook latency, Firebase write errors.
   - Business KPIs: number of paid matches per day, total entry volume, fee revenue, withdrawal volume.
2. Alerting rules (PagerDuty, Slack, etc.) for critical conditions: RPC outage, escrow mismatch, audit log gaps, abnormal withdrawal spike.
3. Runbooks documented in `docs/runbooks/` for:
   - Treasury key rotation.
   - Emergency pause / resume.
   - Solana outage handling (switch to queued mode, replay steps).
   - Fraud escalation and chargeback handling.
4. Monitoring infrastructure updates:
   - Cloudflare Logpush or Workers Analytics Engine export for DO metrics.
   - Firebase log sinks into BigQuery for long-term retention.
   - Grafana / Looker dashboards referencing metrics sources.

## Implementation Checklist

**Phase Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

**⚠️ IMPORTANT:** If you encounter anything confusing, ambiguous, or unclear during implementation, STOP and ask the user (master) for clarification. Do not make assumptions.

### Deliverables Checklist
- [ ] Deliverable 1: Metrics plan covering on-chain, off-chain, and business KPIs
- [ ] Deliverable 2: Alerting rules for critical conditions
- [ ] Deliverable 3: Runbooks documented in `docs/runbooks/`
- [ ] Deliverable 4: Monitoring infrastructure updates

### Implementation Steps
- [ ] **Step 1:** Instrument on-chain program with Anchor events for deposits, withdrawals, prize distributions, and pauses; ingest via webhook or log scraper.
- [ ] **Step 2:** Extend Cloudflare Worker to emit structured logs (JSON) and send critical alerts via webhook when thresholds hit.
- [ ] **Step 3:** Configure Solana RPC health checks (multiple providers) and add automatic failover list.
- [ ] **Step 4:** Build dashboards showing paid vs free match mix, fee revenue, outstanding escrow amounts, and compliance stats (KYC tiers, frozen users).
- [ ] **Step 5:** Write runbooks with clear steps, required tools, contact trees, and validation checklists.
- [ ] **Step 6:** Define retention policies for audit logs and metrics (e.g., 7 years for financial records).
- [ ] **Step 7:** **After ANY code change in this phase:** Run full test suite: `anchor build && anchor test && cargo check && cargo fmt && pnpm lint && pnpm test`. This ensures instrumentation doesn't regress the core codebase. Prior to changes, audit existing monitoring scripts/dashboards.
- [ ] **Step 8:** Use Solana Expert MCP tools for any Solana or Anchor instrumentation questions that arise during this phase.

### Testing Checklist
- [ ] Chaos exercise: Simulate RPC outage
- [ ] Chaos exercise: Simulate Stripe chargeback
- [ ] Chaos exercise: Simulate audit log gap
- [ ] Alert smoke test: Notifications trigger and include actionable info
- [ ] Runbook dry run: On-call engineers complete runbook steps

### Exit Criteria Checklist
- [ ] Dashboards live with agreed KPIs
- [ ] Alert policies deployed and tested
- [ ] Runbooks approved by compliance and operations leads
- [ ] All checkboxes above are checked ✅

## File & Module Impact

- `docs/runbooks/` (multiple markdown files)
- `infra/cloudflare/src/monitoring.ts` enhancements
- Observability config (Grafana JSON, Looker spec) stored under `infra/observability/`
- Event ingestion scripts (could live under `ops/tools/`)

## Testing & Validation

- Chaos exercises simulating RPC outage, Stripe chargeback, and audit log gap.
- Alert smoke tests to ensure notifications trigger and include actionable info.
- Runbook dry runs with on-call engineers.

## Risks & Mitigations

- **Alert fatigue**: implement multi-level severity and suppression windows.
- **Data retention cost**: tier storage (hot vs cold) and purge according to compliance.
- **Runbook drift**: set quarterly reviews tied to compliance calendar.

## Exit Criteria

- Dashboards live with agreed KPIs.
- Alert policies deployed and tested.
- Runbooks approved by compliance and operations leads.

## Related Docs

- `docs/money-match-plan/architecture-diagram.md` for mapping observability touchpoints across components.
- `docs/money-match-plan/cloudflare-worker.md` which defines the Worker metrics/health probes instrumented here.
- `docs/money-match-plan/architecture.md` for understanding which responsibilities remain on-chain vs off-chain when writing runbooks.
