# Architecture Decision Records (ADR)

This document captures all major architectural decisions for the Money Match implementation plan.

---

## ADR-001: On-Chain vs Off-Chain State Authority

**Decision:** Dual parallel system with on-chain as primary source of truth, off-chain as fallback when Solana is unavailable or degraded.

**Rationale:**
- On-chain provides cryptographic security and tamper-proof finality
- Off-chain provides real-time performance and resilience during Solana outages
- Parallel execution ensures both systems stay synchronized
- Fallback mechanism prevents service disruption when Solana RPC is down or congested

**State Authority Rules:**
- **During Match:** On-chain (Solana Match account) is source of truth
- **When Solana Unavailable:** Off-chain (Durable Objects) serves as temporary fallback
- **Post-Match:** On-chain (Match.ended_at != 0) is authoritative
- **Off-chain Role:** Cache + optimistic updates + fallback when Solana dead/busy
- **Conflict Resolution:** Always defer to on-chain when available, rollback off-chain on mismatch

**Trade-offs:**
- Complexity: Requires reconciliation system
- Latency: On-chain moves have 400ms-1s latency, off-chain is <100ms
- Security: On-chain is tamper-proof, off-chain requires trust in coordinator

**Date:** 2025-01-20

---

## ADR-002: Token Balance Storage Strategy

**Decision:** Database (PostgreSQL) is primary source of truth for GP/AC balances. On-chain UserAccount stores aggregates only (lifetime_gp_earned, games_played) for leaderboard verification, NOT current balances.

**Rationale:**
- Database storage is cheaper and faster for frequent balance updates
- Players don't need Solana wallets for token-based gameplay
- On-chain aggregates provide verifiable leaderboard data without storing balances
- One-way sync (DB → Solana) simplifies reconciliation

**Storage Architecture:**
- **Primary Storage:** PostgreSQL database (source of truth for balances)
- **On-Chain Storage:** UserAccount PDA stores aggregates only:
  - `lifetime_gp_earned` (total GP earned over lifetime)
  - `games_played`, `games_won`, `win_streak`
  - `total_ac_spent`, `api_calls_made`
  - **NOT stored:** `gp_balance`, `ac_balance` (these live in database only)
- **Sync Strategy:** One-way (DB → Solana for leaderboard aggregates only)
- **Recovery:** Cannot rebuild balances from on-chain (database backups required)

**Why Store Aggregates On-Chain:**
- Leaderboard verification: Players can verify their lifetime stats are correct
- Merkle proof support: Aggregates included in leaderboard snapshots
- Audit trail: Immutable record of lifetime achievements
- Cost efficiency: Only periodic updates needed, not per-transaction

**Trade-offs:**
- Database is single point of failure (mitigated by backups)
- Cannot recover balances from on-chain state alone
- Requires database transaction logging for audit

**Date:** 2025-01-20

---

## ADR-003: Payment Method Constraints

**Decision:** All players in a match MUST use the same payment method. Mixed-payment matches are NOT supported.

**Rationale:**
- Simplifies escrow management and prize distribution
- Prevents complex refund scenarios with mixed payment sources
- Reduces reconciliation complexity
- Clearer user experience

**Constraints:**
- `payment_method` is set at match creation and locked thereafter
- `join_match` instruction validates player's payment method matches match's payment_method
- Mixed-payment matches: Rejected at join time with clear error message
- Escrow account tracks single payment method per match

**Payment Method Options:**
- `wallet`: Self-custody Solana wallet (player signs transactions directly)
- `platform`: Platform custody (player deposits via fiat/card, platform manages wallet)

**Trade-offs:**
- Simplicity: Single payment method per match
- Flexibility: Players cannot mix wallet and platform funding in same match
- User Experience: Players must choose payment method before creating/joining match

**Date:** 2025-01-20

---

## ADR-004: Dual Parallel System Architecture

**Decision:** On-chain and off-chain systems run in parallel, not as sequential fallback. Both paths are always active.

**Rationale:**
- Parallel execution ensures both systems stay synchronized
- Provides redundancy: if one system fails, the other continues
- Enables real-time off-chain gameplay while maintaining on-chain security
- Allows graceful degradation when Solana is unavailable

**Execution Model:**
- **Normal Operation:** Both systems process events in parallel
  - Client → On-chain (Solana transaction)
  - Client → Off-chain (Durable Objects)
  - Both systems maintain state independently
- **Solana Available:** On-chain is authoritative, off-chain mirrors
- **Solana Unavailable/Busy:** Off-chain serves requests, queues for later sync
- **Reconciliation:** Periodic job compares states and alerts on mismatches

**Why Parallel Not Sequential:**
- Sequential fallback would add latency (wait for on-chain failure before using off-chain)
- Parallel execution provides immediate response from off-chain
- Both systems can validate independently, catching errors faster
- Reduces risk of state divergence

**Trade-offs:**
- Complexity: Requires reconciliation system to detect and resolve conflicts
- Resource usage: Both systems process all events
- Consistency: Must handle temporary divergence during Solana outages

**Date:** 2025-01-20

---

## ADR-005: Escrow Lifecycle State Machine

**Decision:** Escrow accounts follow a defined state machine with explicit transitions for all lifecycle events.

**State Transitions:**
1. **Created → Funded → Distributed → Closed** (normal flow)
2. **Created → Funded → Cancelled → Refunded → Closed** (match cancelled)
3. **Created → Funded → Abandoned → ForceDistributed → Closed** (player timeout)

**Timeout Rules:**
- 5 minutes inactive = auto-forfeit
- Forfeited player's stake goes to remaining players or platform fee
- Timeout checked by coordinator, enforced on-chain

**Refund Matrix:**
- **Wallet-funded matches:** Full refund to player wallet
- **Platform-funded matches:** Full refund to platform custody account
- **Partial refunds:** Not supported (all-or-nothing per player)
- **Platform fees:** Not refunded on cancellation (already accrued)

**Date:** 2025-01-20

---

## ADR-006: KYC Enforcement Points

**Decision:** KYC tier checks occur at specific enforcement points, not continuously.

**Enforcement Matrix:**

| Action         | Check Point      | Enforced By    | On Fail         |
|----------------|------------------|----------------|-----------------|
| Deposit        | Before transfer  | Worker         | Reject + notify |
| Create Match   | If paid          | Worker         | Reject          |
| Join Match     | Before escrow    | Worker         | Reject          |
| Withdraw       | Before release   | Worker + Chain | Hold + review   |

**KYC Expiry Handling:**
- Grace period: 7 days after expiry
- During grace: Can play but not withdraw
- After grace: Account frozen until re-verified

**Date:** 2025-01-20

---

## ADR-007: Match Type Enum

**Decision:** Match type enum supports multiple match categories beyond free/paid.

**Match Types:**
- `Free = 0`: No entry fee, no stakes
- `Paid = 1`: Entry fee, escrow, prizes
- `Tournament = 2`: Linked to tournament_id, special prize pool
- `Benchmark = 3`: AI vs AI (can be all AI, no human), no stakes, for testing/verification. Still stored on-chain/off-chain for trust and reliability
- `Practice = 4`: Free, stats don't count toward leaderboard

**Note:** All match types use the same multiplayer architecture. Even "single player" games (1 human vs AI) are multiplayer by default - they're just 1 human vs 3-10 AI players depending on the game.

**Date:** 2025-01-20

---

## ADR-008: Coordinator Wallet Security

**Decision:** Coordinator uses wallet pool with rotation and monitoring to mitigate centralization risk.

**Security Measures:**
- Wallet pool: Rotate every 1000 transactions
- Rate limiting: Per-wallet transaction limits
- Monitoring: Alerts on unusual patterns (volume, destinations)
- Emergency pause: Program can be paused via `emergency_pause` instruction

**Compromise Response:**
1. Detection: Alert on unusual tx patterns
2. Immediate: Pause program via `emergency_pause`
3. Active Matches: Freeze escrow, no new joins
4. Migration: Deploy new coordinator, update authority on-chain
5. Resume: Unpause after verification

**Date:** 2025-01-20

---

## ADR-009: Dispute Economics

**Decision:** Dispute system funded through invalid dispute forfeitures and platform treasury.

**Economics:**
- Invalid disputes: 100 GP forfeited → Converted to SOL → Validator pool
- Valid disputes: Platform treasury pays validators (0.05 SOL base + 0.02 SOL speed bonus)
- Treasury funding: 5% of all AC purchases + Pro subscriptions
- Reserve requirement: Must maintain 3 months validator runway
- If reserve low: Pause disputes until refunded

**Date:** 2025-01-20

---

## ADR-010: Error Code Namespace

**Decision:** Error codes use reserved ranges to prevent collisions.

**Error Code Ranges:**
- `GameError`: 1000-1999
- `EscrowError`: 2000-2999
- `DepositError`: 3000-3999
- `DisputeError`: 4000-4999
- `StorageError`: 5000-5999
- `NetworkError`: 6000-6999

**Date:** 2025-01-20

---

## ADR-011: API Versioning Strategy

**Decision:** Cloudflare Worker API uses URL-based versioning with backward compatibility guarantees.

**Versioning:**
- URL format: `/api/v1/matches/:matchId`
- Current version: v1
- Backward compatibility: v1 must work for 6 months after v2 launch
- Version header: `X-API-Version: 1` (optional, defaults to v1)
- Deprecation notice: 90 days before removal

**Date:** 2025-01-20

---

## ADR-012: Test Fixtures Specification

**Decision:** Shared test fixtures under `test-data/` provide deterministic cross-language test data.

**Fixture Contents:**
- `matches.json`: 10 matches (5 free, 3 paid wallet, 2 paid platform)
- `users.json`: 20 users (5 per KYC tier: none, basic, enhanced, restricted)
- `leaderboard.json`: Top 100 snapshot (deterministic scores)
- `escrow-states.json`: All escrow lifecycle states
- `loaders.ts`: Typed loader utilities for Rust/TS tests

**Date:** 2025-01-20

