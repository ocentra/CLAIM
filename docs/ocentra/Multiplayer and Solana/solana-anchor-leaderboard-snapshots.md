# 📄 **`solana-anchor-leaderboard-snapshots.md`**

**Solana Anchor Program Layout – Leaderboard Snapshots**

**Version:** 1.0

**Author:** ChatGPT

**Last Updated:** 2025-11-17

---

# **1. Overview**

This document describes the **Solana Anchor program layout** for **leaderboard snapshot handling** in the Money Match system.

Responsibilities:

1. Store **Top 100 leaderboard** on-chain

2. Accept signed snapshots from **Cloudflare Worker** (off-chain)

3. Verify integrity and authority of snapshots

4. Maintain history for auditing

---

# **2. Program Structure**

```

programs/

└─ leaderboard_snapshots/

    ├─ src/

    │    ├─ lib.rs                # Entry point, instruction registration

    │    ├─ instructions/

    │    │    └─ submit_snapshot.rs  # Snapshot submission instruction

    │    ├─ state/

    │    │    ├─ leaderboard.rs      # Top100 leaderboard account

    │    │    └─ snapshot_history.rs # Historical snapshots

    │    ├─ errors.rs                 # Custom errors

    │    └─ constants.rs              # Config constants (max entries, fee %)

    └─ Cargo.toml

```

---

# **3. Accounts**

### **3.1 GlobalLeaderboardAccount**

* Stores **Top 100 entries**

* PDA derived from: `["leaderboard", program_id]`

* Fields:

```rust

pub struct LeaderboardEntry {

    pub wallet: Pubkey;

    pub score: u64;

    pub elo: u64;

    pub rank: u8;

}

#[account]

pub struct GlobalLeaderboardAccount {

    pub top_entries: [LeaderboardEntry; 100];

    pub last_snapshot_time: i64;   // Unix timestamp

    pub snapshot_version: u32;     // Incremental version

    pub merkle_root: [u8; 32];    // Optional: full leaderboard Merkle root

}

```

---

### **3.2 SnapshotHistoryAccount**

* Stores **archived snapshots**

* PDA derived from: `["snapshot_history", snapshot_version]`

* Fields:

```rust

#[account]

pub struct SnapshotHistory {

    pub snapshot_version: u32;

    pub submitted_by: Pubkey;    // Cloudflare Worker authority

    pub top_entries: [LeaderboardEntry; 100];

    pub merkle_root: [u8; 32];

    pub timestamp: i64;

    pub signature: [u8; 64];     // Ed25519 signature by authority

}

```

---

# **4. Instructions**

### **4.1 submit_snapshot**

* **Accounts:**

  * `global_leaderboard` (mutable)

  * `snapshot_history` (mutable)

  * `authority` (signer) – Cloudflare Worker PDA

* **Arguments:**

  * `top_entries: [LeaderboardEntry; 100]`

  * `merkle_root: [u8; 32]`

  * `timestamp: i64`

  * `signature: [u8; 64]`

* **Steps:**

  1. Verify `authority` PDA matches program config

  2. Verify `signature` over snapshot payload

  3. Update `GlobalLeaderboardAccount` with new top_entries, merkle_root, timestamp, version++

  4. Create `SnapshotHistoryAccount` for archive

---

### **4.2 Optional: prune_snapshots**

* Prune old snapshots to save storage

* Keep last N versions (e.g., 10)

---

# **5. PDA Derivation**

| Account                  | Seeds                                    |
| ------------------------ | ---------------------------------------- |
| GlobalLeaderboardAccount | `["leaderboard", program_id]`            |
| SnapshotHistoryAccount   | `["snapshot_history", snapshot_version]` |

> Ensures deterministic address generation and prevents collisions.

---

# **6. Error Handling**

* `InvalidAuthority` – submitted by unauthorized signer

* `InvalidSignature` – signature does not match payload

* `SnapshotTooOld` – timestamp older than current leaderboard

* `ExceedsMaxEntries` – more than 100 entries submitted

* `DuplicateVersion` – snapshot version already exists

---

# **7. Security Considerations**

1. **Authority Verification** – Only Worker PDA allowed to submit snapshots

2. **Signature Verification** – Ed25519 signature over full payload

3. **Versioning** – Prevent replay or old snapshots from overwriting

4. **Immutable History** – SnapshotHistoryAccount provides audit trail

5. **Data Size / Compute Budget** – Ensure account size < max (1232 bytes per zero-copy struct may require compression)

---

# **8. Notes**

* **Deterministic Sorting:** Off-chain Worker must submit **pre-sorted leaderboard** by rank/ELO

* **Merkle Root:** Optional for auditing full leaderboard outside top 100

* **Future Expansion:** Can extend to store **top N per region** or **top X per tournament**

---

# **9. Summary**

This Anchor program layout provides:

* Authoritative storage for top 100 leaderboard

* Secure snapshot submission from off-chain Worker

* Immutable history for audit and compliance

* Lightweight, zero-copy accounts for efficiency

> Fully integrated with **off-chain Worker**, **Cloudflare DOs**, and **Solana escrow system**.

---

# ✔️ **File complete: `solana-anchor-leaderboard-snapshots.md`**

