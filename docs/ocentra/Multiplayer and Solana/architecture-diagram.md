# 📄 **`architecture-diagram.md`**

**Money Match System – Architecture Diagram & Component Flow**

**Version:** 1.0

**Author:** ChatGPT

**Last Updated:** 2025-11-17

---

# **1. Overview**

This document illustrates the architecture of the **Solana-based Money Match System** with parallel **on-chain and off-chain processing**. It shows:

* Solana program responsibilities (paid match escrow, top 100 leaderboard)

* Off-chain Cloudflare Worker orchestration

* TypeScript client interactions

* Database and persistence layers (Cloudflare D1/Firebase)

* Snapshot & leaderboards submission

---

# **2. Architecture Components**

```

+--------------------+       +----------------------+

|  TypeScript Client | <---> |  Cloudflare Worker   |

|  (React/Web)       |       |  (DOs + Rust/WASM)  |

| - create/join      |       | - MatchShardDO      |

| - deposit/withdraw |       | - PlayerShardDO     |

| - query leaderboard|       | - LeaderboardDO     |

+--------------------+       | - MatchCoordinatorDO|

                             | - WASM modules      |

                             +----------+-----------+

                                        |

                                        v

                              +-------------------+

                              |  Cloudflare D1/   |

                              |  Durable Storage   |

                              | - Player stats     |

                              | - Match states     |

                              | - Snapshots        |

                              +-------------------+

                                        |

                                        v

                             +---------------------+

                             |  Solana Program      |

                             |  (Anchor)           |

                             | - Match escrow       |

                             | - Prize distribution |

                             | - Top 100 leaderboard|

                             | - Snapshot storage   |

                             +---------------------+

                                        ^

                                        |

                             +---------------------+

                             |  Solana Wallets     |

                             | - Player deposits   |

                             | - Escrow interactions|

                             +---------------------+

```

---

# **3. Flow Descriptions**

## **3.1 Match Creation**

1. Client requests match creation → Worker

2. Worker allocates `MatchShardDO`, optionally locks funds in deposit account

3. Worker responds with match ID → client joins

---

## **3.2 Match Participation**

1. Client joins match → Worker validates funds/escrow

2. Updates PlayerShardDO & MatchShardDO

3. For paid matches: reserve funds in DO/local escrow

---

## **3.3 Match Completion**

1. Worker receives results

2. WASM computes deterministic ELO, fee, prize split

3. Updates PlayerShardDO and LeaderboardDO

4. Cloudflare D1 persists state

5. Optional notification → Client

---

## **3.4 Leaderboard Snapshot**

1. Worker periodically triggers snapshot

2. LeaderboardDO builds **Top 100** and computes **Merkle root** for full leaderboard

3. Signs snapshot with authority key

4. Submits snapshot to Solana program

5. Anchor program verifies signature → updates on-chain `GlobalLeaderboardAccount`

---

## **3.5 Fallback / High Availability**

* Free matches continue if Solana RPC offline

* Paid matches queued in Worker/DOs

* Reconciliation occurs when Solana comes back online

* Worker ensures **state consistency** and **atomic updates** using DOs

---

# **4. Data Persistence Overview**

| Layer                 | Stored Data                                                      |
| --------------------- | ---------------------------------------------------------------- |
| Cloudflare D1 / DOs   | Player stats, Match state, Leaderboard snapshots                 |
| Firebase Auth/Profile | KYC flags, custody opt-in, wallet references                     |
| Solana Program        | Match escrow, Prize distribution, Top 100 snapshot, Merkle roots |

---

# **5. Security & Governance**

* Escrow accounts & prize distributions on-chain

* Leaderboard snapshots signed by Worker authority PDA

* Deposits & withdrawals validated on-chain/off-chain

* KYC/AML enforced in Firebase & DOs

* Emergency pause via Solana config account

---

# **6. Notes / Best Practices**

* Top 100 leaderboard stored on-chain; rest stored off-chain for scalability

* All off-chain computations deterministic and auditable

* Use Cloudflare DOs for single-threaded updates to avoid race conditions

* Ensure Worker ↔ Solana snapshot submission is signed and verifiable

---

# **7. Summary**

This architecture allows **parallel execution** of on-chain and off-chain processes:

* On-chain: authoritative escrow, top 100 leaderboard, prize distribution

* Off-chain: full match history, scoring, leaderboard snapshots, fallback handling

> This design balances **scalability**, **security**, and **compliance**, providing a clear separation of concerns.

---

