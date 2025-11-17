# 📄 **`rfc-onchain-offchain-system.md`**

**RFC: Hybrid On-Chain + Off-Chain Match & Leaderboard Architecture**

---

# **RFC: Hybrid On-Chain + Off-Chain Match Result System**

**Document Version:** 1.0

**Status:** Draft

**Author:** ChatGPT

**Last Updated:** 2025-11-17

---

# **1. Abstract**

This document describes a **hybrid dual parallel architecture** where:

* **On-Chain (Solana, Anchor)** stores *authoritative long-term data* (primary source of truth):

  * global leaderboard snapshots

  * top 100 / seasonal ranks

  * high-stakes / audited matches

  * tokenized rewards and distribution

  * anti-cheat hashes & cryptographic proofs

* **Off-Chain (Cloudflare Workers + D1/DO)** processes:

  * all *live* match flow (fast, cheap)

  * matchmaking

  * result validation

  * ELO updates

  * fraud detection

  * rolling "candidate leaderboard"

  * **Fallback when Solana is unavailable or degraded**

**State Authority:**
- **During Match:** On-chain (Solana Match account) is source of truth
- **When Solana Unavailable:** Off-chain (Durable Objects) serves as temporary fallback
- **Post-Match:** On-chain (Match.ended_at != 0) is authoritative
- **Conflict Resolution:** Always defer to on-chain when available, rollback off-chain on mismatch

Both systems run **in parallel** (not sequential fallback). On-chain is authoritative when available, off-chain serves as fallback when Solana RPC is down or congested.

Only *finalized* top-tier ranking data is committed on-chain.

---

# **2. Motivation**

Why hybrid?

| Area              | On-Chain           | Off-Chain           |

| ----------------- | ------------------ | ------------------- |

| Speed             | ❌ slow, txn fees   | ✅ microseconds      |

| Security          | ✅ tamper-proof     | ❌ requires trust    |

| Storage           | ❌ expensive        | ✅ unlimited & cheap |

| Leaderboard needs | ❌ not real-time    | ✅ real-time         |

| Final awards      | ✅ must be on-chain | ❌ not secure enough |

The solution:

**Off-chain runs everything instantly; on-chain receives periodic signed proofs.**

---

# **3. Goals**

### **3.1 Functional**

* Real-time matchmaking, scoring, and ranking off-chain.

* Every match signed by Cloudflare Worker (service identity).

* Every X hours, submit:

  * aggregated leaderboard root hash

  * top 100 ranks

  * season snapshot

* Users can verify off-chain results with:

  * `MatchProof { match_id, player_pubkey, server_signature }`

  * `LeaderboardRoot { merkle_root, submitted_by, timestamp }`

### **3.2 Non-Functional**

* Fast (p99 < 30ms).

* Scalable to 100k concurrent users.

* Inexpensive (Cloudflare: <$0.10/million).

* Minimal Solana transactions.

---

# **4. System Overview**

## 4.1 Dual Parallel Data Flow

```

Players → Game Client → (parallel writes)
                          ├─→ Cloudflare Worker → DO Database (off-chain)
                          └─→ Anchor Program (on-chain, primary source of truth)

```

1. **Off-chain path (fast lane, fallback when Solana unavailable)**

   ```

   match_start → match_end → validate → score → update ELO → update soft leaderboard

   ```

2. **On-chain path (authoritative, primary source of truth)**

   Real-time (when Solana available):

   ```

   match_start → match_end → escrow → prize_distribution → snapshot

   ```

   Periodic snapshots:

   ```

   snapshot(offchain_leaderboard) 

      → merkle_root 

      → anchor::submit_snapshot()

   ```

**Why Parallel Not Sequential:**
- Parallel execution ensures both systems stay synchronized
- Provides redundancy: if one system fails, the other continues
- Enables real-time off-chain gameplay while maintaining on-chain security
- Allows graceful degradation when Solana is unavailable

---

# **5. Match Lifecycle**

### **5.1 Steps**

1. Player joins a match (match_id generated).

2. Worker validates the players & signatures.

3. Match finishes → client sends results.

4. Worker recomputes its own deterministic score (no trust in client).

5. Fraud checks run:

   * anti-speedhack timings

   * same-user multi-login

   * suspicious patterns

6. Worker issues a **Server Signed MatchResult**:

   ```

   { match_id, p1_score, p2_score, timestamp, server_signature }

   ```

7. Data stored in DO.

8. Worker computes updated ELO / MMR.

9. Leaderboard table updated (soft leaderboard).

10. Periodic aggregator sends snapshot to Solana.

---

# **6. On-Chain Data Model (High-Level)**

Anchor program stores durable values:

```

GlobalLeaderboardAccount {

    season_id: u64,

    top_players: [PlayerEntry; 100],

    merkle_root: [u8; 32],

    last_update_ts: i64,

}

```

Plus optional:

```

SeasonResultsAccount

DailySnapshotAccount

AuditLog

```

---

# **7. Off-Chain Data Model (High-Level)**

Cloudflare DO:

### `matches`

```

id, player1, player2, result_json, server_sig, created_at

```

### `player_ratings`

```

player, elo, wins, losses, last_match_ts

```

### `leaderboard`

```

player, score, rank, updated_at

```

---

# **8. Leaderboard Flow**

### **Off-chain runs the "live" leaderboard**

Updated every match.

### **On-chain gets periodic snapshots**

Example:

* Every hour

* At season end

* When prize pool distribution needed

The snapshot contains:

```

top_100 = SELECT * FROM leaderboard ORDER BY score DESC LIMIT 100

merkle_root = merkelize(full_leaderboard)

anchor.submit_snapshot(top_100, merkle_root)

```

---

# **9. Security Architecture**

## 9.1 Worker identity signing

Every match result is signed using Cloudflare Worker private key stored in:

* Cloudflare Workers KV

* or better: Cloudflare Secret Storage

Signature format:

```

ed25519(server_secret, match_payload)

```

## 9.2 Client validation

Clients must send:

* wallet signature (session authenticate)

* match telemetry

* replay-safe nonce

## 9.3 Fraud detection

* IP reuse patterns

* impossible frame timings

* too-fast input

* correlated alt account behavior

* abnormal win streak vs ELO

---

# **10. Merkle Proof System**

Full leaderboard → Merkle tree → On-chain hash.

Players can:

* query leaf path from Cloudflare

* verify against on-chain merkle_root

* verify match proofs

This ensures:

**off-chain is fast, but still cryptographically verifiable.**

---

# **11. Snapshot Submission Protocol**

1. Worker builds:

   ```

   Snapshot {

       season_id,

       top_100[],

       merkle_root,

       timestamp,

       authority_signature

   }

   ```

2. Client/worker submits to Solana:

   ```

   submit_snapshot(snapshot)

   ```

3. Anchor program verifies signature matches allowed authority.

4. On-chain state updates.

---

# **12. Failure Recovery**

* If Worker goes down → cached DO state persists.

* If Solana unavailable → next snapshot resubmits.

* If database corrupt → rebuild from matches table + deterministic ELO.

---

# **13. Appendix A: Example MatchResult Payload**

```json

{

  "match_id": "M12391",

  "players": ["F1...", "F9..."],

  "scores": { "p1": 2, "p2": 0 },

  "duration_ms": 91342,

  "timestamp": 1731828213,

  "server_signature": "8d9f..."

}

```

---

# **14. Appendix B: Example Leaderboard Snapshot**

```json

{

  "season_id": 7,

  "timestamp": 1731829000,

  "top_100": [

    { "wallet": "Gx...", "elo": 2103 },

    { "wallet": "Af...", "elo": 2097 }

  ],

  "merkle_root": "98bc01fd51..."

}

```

---

# ✔️ **File #2 complete**

