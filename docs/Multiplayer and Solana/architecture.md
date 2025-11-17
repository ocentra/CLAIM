# **On-Chain / Off-Chain Dual System Architecture**

**Version:** 1.0

**Status:** Draft

**Last Updated:** 2025-11-17

---

# 1. Overview

This document describes a **dual parallel architecture** where:

* **On-Chain (Solana)** acts as **primary source of truth** for:

  * reward settlement

  * stake escrow

  * season snapshots

  * top-100 leaderboard commitments

  * match result hashes (verification root)

* **Off-Chain (Cloudflare Workers + Durable Objects)** handles:

  * real-time gameplay

  * matchmaking

  * **full leaderboard (>100k players)** - complete historical rankings

  * **all match history** - older games, full match records, detailed logs

  * analytics

  * anti-cheat verification

  * match logs + replay storage

  * webhook/push notifications

  * **Fallback when Solana is unavailable or degraded**

**Storage Distribution:**
- **Off-chain stores:** All match history, full leaderboard (unlimited players), older/completed matches, detailed match logs, replay data
- **On-chain stores:** Recent/active matches, top-100 leaderboard snapshots, match result hashes (verification roots), escrow for money matches, season snapshots

**Architecture Principle:** Both systems run **in parallel** (not sequential fallback). On-chain is authoritative when available, off-chain serves as fallback when Solana RPC is down or congested. This ensures service continuity while maintaining cryptographic security.

**State Authority:**
- **During Match:** On-chain (Solana Match account) is source of truth
- **When Solana Unavailable:** Off-chain (Durable Objects) serves as temporary fallback
- **Post-Match:** On-chain (Match.ended_at != 0) is authoritative
- **Conflict Resolution:** Always defer to on-chain when available, rollback off-chain on mismatch

Money matches are optional. Free matches, leaderboards, and benchmark modes continue to function even when custody features are disabled. Both the on-chain and off-chain paths run **in parallel** and converge using **verifiable summaries** stored on-chain.

---

# 2. High-Level Architecture Diagram (ASCII)

```

               ┌─────────────────────────────────────────┐

               │                 CLIENT                   │

               │  - Player Actions                       │

               │  - Wallet Signatures                    │

               │  - UI / Game Rendering                  │

               └──────────────────────┬──────────────────┘

                                      │

                                      │

                              (parallel writes)

                                      │

       ┌──────────────────────────────┼──────────────────────────────┐

       │                              │                              │

       ▼                              ▼                              ▼

┌──────────────────┐        ┌────────────────────────┐     ┌──────────────────────┐

│  OFF-CHAIN GAME  │        │   ON-CHAIN PROGRAM     │     │   INDEXERS (RPC /    │

│     SERVER       │        │      (Anchor)          │     │   Helius/Triton)     │

│ Cloudflare DO    │        │   - Escrow             │     └──────────────────────┘

│ - Matchmaking    │        │   - Reward Settlement  │

│ - Real-time calc │        │   - Snapshot Storage   │

│ - Leaderboard    │        │   - Match Hash Store   │

│ - MMR/ELO        │        └────────────────────────┘

│ - Anti-cheat     │

└──────────────────┘

       │

       │ writes summary hash

       ▼

┌─────────────────────────────────────────────────────────────┐

│                  FINALIZATION PIPELINE                      │

│  - Server sends match summary hash to chain                 │

│  - Chain verifies signature + proof (optional Merkle root)  │

│  - Season top-100 snapshot committed                        │

└─────────────────────────────────────────────────────────────┘

```

---

# 3. Detailed Layer Diagram (SVG-like Markdown)

```

+-------------------------------------------------------------+

|                           CLIENT                            |

|-------------------------------------------------------------|

|  React/TS Frontend                                          |

|  - Game UI                                                  |

|  - Input dispatch                                           |

|  - Wallet adapter                                           |

+-----------------------------+-------------------------------+

                              |

                              |

                              v

+-----------------------------+-------------------------------+

|                 OFF-CHAIN PROCESSING (Cloudflare)           |

|-------------------------------------------------------------|

|  Durable Object: PlayerState                                |

|    - session tokens                                          |

|    - real-time MMR updates                                   |

|    - anti-cheat model cache                                  |

|                                                             |

|  Durable Object: MatchState                                 |

|    - game state machine                                      |

|    - bet logic                                               |

|    - randomization rng seed                                  |

|                                                             |

|  DO / KV: Leaderboard                                        |

|    - full ranking (>100k players)                            |

|    - season progress                                         |

|                                                             |

|  Workers:                                                    |

|    - entrypoints / rpc-like endpoints                        |

|    - data verification                                       |

|    - notifications                                           |

+-----------------------------+-------------------------------+

                              |

                              | final proof

                              v

+-----------------------------+-------------------------------+

|                 ON-CHAIN (Solana via Anchor)                |

|-------------------------------------------------------------|

|  Program accounts:                                          |

|    - SeasonState                                             |

|    - Top100Snapshot                                          |

|    - MatchResultHash                                         |

|                                                             |

|  Smart contracts handle:                                    |

|    - escrow                                                  |

|    - reward distribution                                     |

|    - top100 verification                                     |

|    - event emissions                                         |

+-------------------------------------------------------------+

```

---

# 4. Data Flow Diagram

## **4.1 Gameplay Phase (Real-Time)**

```

Client

  ↓ action

Cloudflare DO (MatchState)

  ↓ updates buffer

Cloudflare DO (Leaderboard)

  ↓ store result

Optional: Cloudflare KV (replays/logs)

```

## **4.2 Settlement Phase (End-of-Match)**

```

Cloudflare → generate match_result_hash

Cloudflare → submit instruction to Solana Program

Solana Program → verifies + stores hash

```

## **4.3 Season Finalization**

```

Cloudflare Worker generates:

  - ordered top-100 list

  - merkle_root_all_players

Worker → Solana Instruction:

  set_top100_snapshot(

      top100: [Pubkey; 100],

      merkle_root: [u8; 32]

  )

```

---

# 5. On-Chain Responsibilities

### **Mandatory On-Chain**

* Escrow & rewards

* Final match hashes

* Season finalization

* Top 100 snapshot

* Merkle root of full leaderboard (optional but recommended)

* Emitting events for indexers

### **Never On-Chain**

* Match data

* Player actions

* Leaderboard >100 entries

* Replay logs

* Game internal state

---

# 6. Off-Chain Responsibilities (Cloudflare)

### **Core Off-Chain Tasks**

* Real-time game logic

* Update leaderboards

* MMR/ELO

* Player stats

* Anti-cheat checks

* RNG (deterministic or VRF-assisted)

* Store full match transcript

* Notify users

* Periodically push summaries to chain

---

# 7. Anti-Cheat Framework

### Recommended pipeline:

1. **Client Actions are never trusted**

2. **Durable Object executes deterministic state machine**

3. **Timestamps & signature verification**

4. **Replayable match log stored**

5. **Hash committed on-chain**

Optional:

* Statistical cheat detection

* Multi-session correlation

* Device fingerprinting

---

# 8. Summary

This architecture gives you:

* Scalability (off-chain heavy ops)

* Trust (on-chain finality)

* Real-time performance (Cloudflare)

* Verifiability (Merkle + hashes)

* Fortified anti-cheat

* Cost control (minimal chain writes)

---

# 9. Files in This Specification

This architecture file supports the remaining documents:

| File                             | Purpose                       |

| -------------------------------- | ----------------------------- |

| `rfc-onchain-offchain-system.md` | Full RFC, requirements, flows |

| `cloudflare-db-schema.md`        | Durable Object + KV schema    |

| `leaderboard-anchor.md`          | Solana program state layout   |

| `cloudflare-worker.md`           | Match handling worker code    |

---

# **END OF FILE — `architecture.md`**

---

