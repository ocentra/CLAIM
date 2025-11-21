# 📄 **`cloudflare-db-schema.md`**

**Cloudflare D1/DO Database Schema for Off-Chain Match + Leaderboard System**

**Version:** 1.0

**Last Updated:** 2025-11-17

**Author:** ChatGPT

---

# **1. Overview**

This document specifies the **complete database schema** used by the off-chain computation system running in Cloudflare Workers, backed by:

* **Cloudflare D1** (SQLite-like, relational queries)

* **Cloudflare Durable Objects** (strong consistency, atomic updates, sharding by player ID or match ID)

This DB stores everything needed for:

* Matchmaking

* Match results

* ELO calculations

* Real-time leaderboards

* Snapshot generation for Solana

This schema is safely indexable, efficient, and designed for **Cursor to directly generate migrations + code**.

---

# **2. Entity Relationship Diagram (Markdown ASCII)**

```

+-------------------+          +-------------------------+

|     players       | 1      n |       player_ratings    |

|-------------------|----------|--------------------------|

| wallet (PK)       |          | id (PK)                 |

| created_at        |          | wallet (FK)             |

+-------------------+          | elo                     |

                               | wins                    |

                               | losses                  |

                               | last_match_ts           |

                               +-------------------------+

           1           n

+-------------------+----------+----------------------------+

|      matches      |          |        match_events        |

|-------------------|          |----------------------------|

| id (PK)           |          | id (PK)                   |

| match_id (unique) |          | match_id (FK)             |

| player1_wallet    |          | event_type                |

| player2_wallet    |          | event_payload (JSON)      |

| result_json       |          | ts                        |

| server_signature  |          +----------------------------+

| created_at        |

+-------------------+

                 1           n

+-------------------+----------+---------------------------+

|    leaderboard    |          |     leaderboard_history   |

|-------------------|          |---------------------------|

| wallet (PK)       |          | id (PK)                  |

| rank              |          | snapshot_ts              |

| score             |          | wallet                   |

| elo               |          | rank                     |

| updated_at        |          | elo                      |

+-------------------+          | score                    |

                               +---------------------------+

```

---

# **3. Core Tables**

---

# **3.1 `players`**

Tracks all players who have ever participated.

Mainly used for identity indexing.

```sql

CREATE TABLE players (

    wallet TEXT PRIMARY KEY,

    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))

);

```

---

# **3.2 `player_ratings`**

Real-time rankings and stats.

```sql

CREATE TABLE player_ratings (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    wallet TEXT NOT NULL,

    elo INTEGER NOT NULL DEFAULT 1200,

    wins INTEGER NOT NULL DEFAULT 0,

    losses INTEGER NOT NULL DEFAULT 0,

    last_match_ts INTEGER NOT NULL,

    UNIQUE(wallet)

);

```

### Indexes:

```sql

CREATE INDEX idx_player_ratings_elo ON player_ratings (elo DESC);

CREATE INDEX idx_player_ratings_lastmatch ON player_ratings (last_match_ts DESC);

```

---

# **3.3 `matches`**

Authoritative record of every match result, with server signature.

```sql

CREATE TABLE matches (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    match_id TEXT NOT NULL UNIQUE,

    player1_wallet TEXT NOT NULL,

    player2_wallet TEXT NOT NULL,

    result_json TEXT NOT NULL,

    server_signature TEXT NOT NULL,

    created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),

    

    FOREIGN KEY(player1_wallet) REFERENCES players(wallet),

    FOREIGN KEY(player2_wallet) REFERENCES players(wallet)

);

```

### Indexes:

```sql

CREATE INDEX idx_matches_player1 ON matches (player1_wallet);

CREATE INDEX idx_matches_player2 ON matches (player2_wallet);

CREATE INDEX idx_matches_created ON matches (created_at DESC);

```

---

# **3.4 `match_events`**

Optional, stores detailed telemetry per match for anti-cheat.

```sql

CREATE TABLE match_events (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    match_id TEXT NOT NULL,

    event_type TEXT NOT NULL,

    event_payload TEXT NOT NULL,  -- JSON

    ts INTEGER NOT NULL,

    FOREIGN KEY(match_id) REFERENCES matches(match_id)

);

```

Index:

```sql

CREATE INDEX idx_match_events_matchid ON match_events (match_id);

```

---

# **3.5 `leaderboard`**

Real-time leaderboard used by the front-end.

```sql

CREATE TABLE leaderboard (

    wallet TEXT PRIMARY KEY,

    rank INTEGER NOT NULL,

    score INTEGER NOT NULL,

    elo INTEGER NOT NULL,

    updated_at INTEGER NOT NULL

);

```

Index:

```sql

CREATE INDEX idx_leaderboard_rank ON leaderboard (rank);

CREATE INDEX idx_leaderboard_score ON leaderboard (score DESC);

```

---

# **3.6 `leaderboard_history`**

Keeps daily/hourly snapshots for audit & for on-chain uploads.

```sql

CREATE TABLE leaderboard_history (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    snapshot_ts INTEGER NOT NULL,

    wallet TEXT NOT NULL,

    rank INTEGER NOT NULL,

    elo INTEGER NOT NULL,

    score INTEGER NOT NULL

);

```

---

# **3.7 `snapshot_root`**

Stores the Merkle roots that are sent to Solana.

```sql

CREATE TABLE snapshot_root (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    snapshot_ts INTEGER NOT NULL,

    season_id INTEGER NOT NULL,

    merkle_root TEXT NOT NULL,

    top_json TEXT NOT NULL, -- serialized top100

    submitted_onchain INTEGER DEFAULT 0

);

```

Index:

```sql

CREATE INDEX idx_snapshot_ts ON snapshot_root (snapshot_ts DESC);

```

---

# **4. Recommended Durable Object Shards**

---

# **4.1 PlayerShard DO**

Keyed by wallet prefix (`wallet.substring(0,2)`).

Stores:

* ELO

* MM state

* in-flight match state

* fraud flags

Sample DO storage:

```ts

{

  elo: 1450,

  inMatch: false,

  lastMatch: "M12313",

  suspiciousScore: 0,

}

```

---

# **4.2 MatchShard DO**

Keyed by match_id.

Stores:

* Connected players

* State

* Telemetry

* Final authoritative scores

---

# **4.3 LeaderboardShard DO**

Keeps an in-memory sorted structure for fast read:

* Red-black tree

* or array + binary insertion

* or min-heap for top 100

Periodically flushed to D1.

---

# **5. Data Flow Summary**

```

Game Client

    → Worker API

        → DO(PlayerShard)

            → DO(MatchShard)

                → Store final result in D1(matches)

                → Update D1(player_ratings)

                → Update D1(leaderboard)

        → Snapshot job → D1(snapshot_root)

            → send_snapshot_to_solana()

```

---

# **6. Transactional Guarantees**

Durable Objects provide:

* Single-threaded execution per ID

* Strong consistency inside each DO

* Atomic operations for ELO updates

* No race conditions for match results

D1 is eventually consistent but acceptable because DO enforces correctness.

---

# **7. Query Examples**

### 7.1 Top 100 leaderboard

```sql

SELECT wallet, rank, score, elo

FROM leaderboard

ORDER BY score DESC

LIMIT 100;

```

### 7.2 Player match history

```sql

SELECT * FROM matches

WHERE player1_wallet = ? OR player2_wallet = ?

ORDER BY created_at DESC;

```

### 7.3 Insert match

```sql

INSERT INTO matches (match_id, player1_wallet, player2_wallet, result_json, server_signature)

VALUES (?, ?, ?, ?, ?);

```

---

# ✔️ **File #3 complete.**

