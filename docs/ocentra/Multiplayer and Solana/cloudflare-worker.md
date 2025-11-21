# 📄 **`cloudflare-worker.md`**

**Cloudflare Worker for Off-Chain Match Handling & Leaderboard Management**

**Version:** 1.0

**Author:** ChatGPT

**Last Updated:** 2025-11-17

---

# **1. Overview**

This Worker provides **real-time off-chain match handling**, scoring, and leaderboard management, integrating tightly with:

* Cloudflare Durable Objects (DOs)

* Rust/WASM for deterministic ELO & fee calculation

* D1 database for persistent storage

* Solana Anchor program for snapshot submission

It handles:

1. Paid & free match states

2. Player ELO updates & leaderboard rank

3. Fraud detection and telemetry

4. Snapshot signing and submission to Solana

---

# **2. Directory Layout**

```

infra/cloudflare/

 ├─ src/

 │    ├─ index.ts                     # Main HTTP router

 │    ├─ durable-objects/

 │    │    ├─ PlayerShardDO.ts        # Stores per-player state

 │    │    ├─ MatchShardDO.ts         # Stores per-match state

 │    │    ├─ LeaderboardDO.ts        # Maintains top100 in-memory

 │    │    └─ MatchCoordinatorDO.ts   # Orchestrates worker operations

 │    ├─ services/

 │    │    ├─ StateSyncService.ts     # On-chain <-> off-chain sync

 │    │    └─ SolanaHealthMonitor.ts  # RPC endpoint monitoring

 │    └─ wasm/                        # Precompiled Rust/WASM modules

 ├─ package.json

 └─ wrangler.toml

```

---

# **3. Core Durable Objects**

---

## **3.1 PlayerShardDO**

* Keyed by wallet prefix (`wallet.slice(0,2)`)

* Stores:

  * `elo`, `wins`, `losses`

  * `activeMatch` ID

  * Fraud flags

* Provides atomic updates for per-player data

* Ensures single-threaded updates for consistency

**Sample State Schema (TypeScript):**

```ts

interface PlayerState {

  wallet: string;

  elo: number;

  wins: number;

  losses: number;

  activeMatch?: string;

  fraudScore: number;

  lastUpdated: number;

}

```

---

## **3.2 MatchShardDO**

* Keyed by `match_id`

* Stores match state:

  * Players involved

  * Match result (serialized)

  * Start/end timestamps

  * Score calculation

* Ensures **atomic, single-threaded updates** for each match

**Sample State Schema:**

```ts

interface MatchState {

  matchId: string;

  players: string[];

  result?: MatchResult;

  events: MatchEvent[];

  status: 'pending' | 'active' | 'completed';

  createdAt: number;

}

```

---

## **3.3 LeaderboardDO**

* Maintains **top 100 players in-memory**

* Sorted by score/ELO

* Periodically flushed to D1 and submitted on-chain as snapshot

* Accepts incremental updates from PlayerShardDO

**Sample State Schema:**

```ts

interface LeaderboardState {

  topPlayers: PlayerEntry[];  // max 100

  lastUpdated: number;

}

interface PlayerEntry {

  wallet: string;

  elo: number;

  score: number;

  rank: number;

}

```

---

## **3.4 MatchCoordinatorDO**

* Coordinates:

  * New match creation

  * Player joining & payment verification

  * Match completion & result calculation

  * Fraud checks

  * Leaderboard update

* Calls Rust/WASM deterministic scoring functions:

  * ELO calculations

  * Fee splits

  * Prize distributions

---

# **4. Worker HTTP API**

| Method | Path             | Purpose                                 |
| ------ | ---------------- | --------------------------------------- |
| POST   | /match/create    | Create free/paid match                  |
| POST   | /match/join      | Player joins a match                    |
| POST   | /match/submit    | Submit match result (off-chain)         |
| GET    | /leaderboard     | Query top 100 leaderboard               |
| GET    | /player/:wallet  | Fetch player stats                      |
| POST   | /snapshot/submit | Sign + submit top100 snapshot to Solana |

---

# **5. Match Lifecycle**

1. **Create Match**

   * Worker validates request

   * Allocates MatchShardDO

   * Records escrow status (if paid match)

2. **Join Match**

   * Validates player balance / deposit

   * Locks funds in local escrow

   * Updates MatchShardDO & PlayerShardDO

3. **Match Completion**

   * Record winner(s) and compute prize/fees

   * Call WASM module for deterministic ELO & fee split

   * Update PlayerShardDO & LeaderboardDO

4. **Snapshot Generation**

   * Periodically (or triggered):

     * LeaderboardDO produces top100

     * Computes Merkle root for full leaderboard

     * Signs payload with authority key

     * Calls Solana Anchor program `submit_snapshot()`

---

# **6. Fraud & Consistency Checks**

* Ensure **single active match per player**

* Validate deposits / balances before match join

* Detect invalid results / replayed matches

* Track metrics: abnormal score changes, rapid join/leave patterns

* **DO ensures atomic updates**, preventing race conditions

* Any inconsistency → record in `match_events` table, flag for audit

---

# **7. Rust/WASM Integration**

* Deterministic scoring module:

  * `calculate_elo`

  * `calculate_fee_split`

  * `verify_match_integrity`

* Precompiled WASM in `src/wasm/`

* Invoked from Worker via:

```ts

const result = wasm.calculate_elo(players, matchOutcome);

```

* Ensures **identical math with Solana program** if needed

---

# **8. Data Persistence**

* DOs store in-memory state

* Flush to D1:

  * Matches

  * Player ratings

  * Leaderboard snapshots

* Provides **durability** & backup in Cloudflare

---

# **9. Snapshot Submission Flow**

```

1. Worker triggers snapshot job

2. LeaderboardDO produces top100 + merkle_root

3. Worker signs snapshot with authority private key

4. Calls Solana Anchor program:

   submit_snapshot(top_entries, merkle_root, signature)

5. Updates D1 snapshot_root table

```

* Ensures off-chain -> on-chain consistency

* Provides proof for player verification

---

# **10. Health Monitoring & Fallback**

* `SolanaHealthMonitor.ts` pings RPC endpoints

* If Solana unavailable:

  * Continue free matches

  * Queue paid match updates

* `StateSyncService.ts` reconciles queued operations after RPC recovery

---

# **11. Security & Authorization**

* All requests validated with JWT signed by frontend / platform

* Snapshot submission requires **authority signature**

* Prevents unauthorized leaderboard tampering

---

# **12. Observability & Metrics**

* Track:

  * Match counts

  * ELO changes

  * Failed joins / deposits

  * Snapshot submission latency

  * Fraud flags triggered

* Log to Cloudflare Logs / external metrics platform

---

# **13. Summary**

This Worker implements **fully off-chain match orchestration**, deterministic scoring, fraud detection, leaderboard maintenance, and snapshot submission to Solana. Designed for **parallel execution** with on-chain minimal snapshots and persistent off-chain storage.

---

