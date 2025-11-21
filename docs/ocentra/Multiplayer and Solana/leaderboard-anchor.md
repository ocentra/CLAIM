# 📄 **`leaderboard-anchor.md`**

**Solana Anchor Program Layout for Leaderboard Snapshots + Match Proof Root Hashes**

**Version:** 1.0

**Author:** ChatGPT

**Last Updated:** 2025-11-17

---

# **1. Overview**

This Anchor program is responsible for **on-chain, authoritative leaderboard storage**:

* Top 100 leaderboard snapshot

* Season identifier

* Merkle root of full off-chain leaderboard

* Optional audit history

* Authority validation (Cloudflare Worker signer or multisig)

* Reward distribution hooks

* Player verification (optional future extension)

The off-chain system computes match results & leaderboards.

**Only the summarized, verifiable snapshot is written on-chain.**

This document is designed so Cursor can generate the full Anchor project.

---

# **2. Program Structure**

```

program/

 ├─ lib.rs

 ├─ state/

 │    ├─ global_leaderboard.rs

 │    ├─ snapshot_history.rs

 │    └─ constants.rs

 ├─ instructions/

 │    ├─ initialize.rs

 │    ├─ submit_snapshot.rs

 │    ├─ update_season.rs

 │    └─ verify_player_proof.rs (optional)

 └─ errors.rs

```

---

# **3. Accounts**

---

## **3.1 GlobalLeaderboardAccount**

Stores the current season + top 100 snapshot.

```rust

#[account]

pub struct GlobalLeaderboardAccount {

    pub season_id: u64,                // current active season

    pub last_update_ts: i64,           // unix ts of last snapshot

    pub merkle_root: [u8; 32],         // root of full leaderboard tree

    pub top_count: u32,                // count of top entries (usually 100)

    pub top: [PlayerEntry; 100],       // array of rankings

    pub authority: Pubkey,             // worker or multisig

    pub bump: u8,

}

```

---

## **3.2 PlayerEntry**

```rust

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]

pub struct PlayerEntry {

    pub wallet: Pubkey,

    pub elo: u32,

    pub score: u32,

    pub rank: u32,

}

```

---

## **3.3 SnapshotHistoryAccount**

Optional rolling store of historical submitted snapshots.

```rust

#[account]

pub struct SnapshotHistoryAccount {

    pub season_id: u64,

    pub snapshot_id: u64,

    pub timestamp: i64,

    pub merkle_root: [u8; 32],

    pub top_len: u32,

    pub top: Vec<PlayerEntry>,

    pub submitted_by: Pubkey,

}

```

---

## **3.4 Authority PDA (Signer)**

A PDA used to verify that snapshot submissions are from Cloudflare Worker or multisig.

```

authority_pda = seeds: ["authority", global_pubkey]

```

This PDA stores:

* allowed_signer (Pubkey)

* rotating key support

---

# **4. Instructions**

---

## **4.1 initialize()**

Creates the main leaderboard account.

### Purpose

* Set initial season

* Initialize the top array

* Set the authority

### Signature

```rust

pub fn initialize(

    ctx: Context<Initialize>,

    season_id: u64,

    authority: Pubkey

) -> Result<()>;

```

### Accounts

```rust

#[derive(Accounts)]

pub struct Initialize<'info> {

    #[account(init, payer = payer, space = GlobalLeaderboardAccount::SPACE)]

    pub leaderboard: Account<'info, GlobalLeaderboardAccount>,

    #[account(mut)]

    pub payer: Signer<'info>,

    pub system_program: Program<'info, System>,

}

```

---

## **4.2 submit_snapshot()**

The critical instruction that updates the authoritative leaderboard state.

### Purpose

* Update on-chain top 100

* Update Merkle root

* Ensure matches were processed off-chain

* Validate signature from Worker/Authority

* Write history entry (optional)

### Full Signature

```rust

pub fn submit_snapshot(

    ctx: Context<SubmitSnapshot>,

    season_id: u64,

    top_entries: Vec<PlayerEntry>,

    merkle_root: [u8; 32],

    server_signature: [u8; 64]

) -> Result<()>;

```

### Business Logic

1. Assert `season_id == leaderboard.season_id`

2. Verify **server_signature** against authority public key:

   ```

   ed25519_verify(server_pubkey, hash_payload, server_signature)

   ```

3. Ensure `top_entries.len() <= 100`

4. Replace leaderboard.top and merkle root

5. Update timestamp

6. Optionally write SnapshotHistoryAccount

---

### Accounts

```rust

#[derive(Accounts)]

pub struct SubmitSnapshot<'info> {

    #[account(

        mut,

        seeds = [b"leaderboard"],

        bump = leaderboard.bump,

    )]

    pub leaderboard: Account<'info, GlobalLeaderboardAccount>,

    /// CHECK: Verified manually through signature

    pub authority: UncheckedAccount<'info>,

    #[account(mut)]

    pub signer: Signer<'info>,

}

```

---

## **4.3 update_season()**

Resets leaderboard and increments season.

```rust

pub fn update_season(

    ctx: Context<UpdateSeason>,

    new_season_id: u64

) -> Result<()>;

```

Logic:

* Clear top 100

* Reset merkle root

* Update timestamp

* Store new season ID

---

## **4.4 verify_player_proof() (Optional Future)**

Allows players to verify they belong in leaderboard off-chain snapshot using Merkle proofs.

**Not required now**, but RFC includes it for future-proofing.

---

# **5. Event Emissions**

```rust

#[event]

pub struct SnapshotSubmitted {

    pub season_id: u64,

    pub timestamp: i64,

    pub merkle_root: [u8; 32],

}

```

```rust

#[event]

pub struct SeasonUpdated {

    pub new_season_id: u64,

}

```

---

# **6. Security & Signature Verification**

Snapshot payload:

```rust

pub struct SnapshotPayload {

    pub season_id: u64,

    pub merkle_root: [u8; 32],

    pub timestamp: i64,

}

```

Hash payload:

```rust

let message = hash(&bincode::serialize(&payload)?);

verify_signature(server_signature, message, authority_pubkey)?;

```

If signature invalid → reject.

This ensures **Cloudflare Worker cannot be spoofed**.

---

# **7. PDA Layout**

### Leaderboard PDA

```

leaderboard_pda = Pubkey::find_program_address(

    ["leaderboard"],

    program_id

)

```

### Authority PDA

```

authority_pda = Pubkey::find_program_address(

    ["authority", leaderboard.key().as_ref()],

    program_id

)

```

---

# **8. Example TypeScript Frontend Submission**

```ts

const ix = await program.methods

  .submitSnapshot(

    seasonId,

    topEntries,

    merkleRoot,

    serverSignature

  )

  .accounts({

    leaderboard: leaderboardPda,

    authority: CLOUD_WORKER_PUBKEY,

    signer: wallet.publicKey,

  })

  .instruction();

```

---

# **9. Gas & Storage Estimates**

* GlobalLeaderboardAccount ≈ **~15kb**

  * 100 × PlayerEntry (32+4+4+4 = 44 bytes each)

* SnapshotHistoryAccount varies (use sparsely)

* submit_snapshot compute ~80–120k CU

Minimal and fits budget easily.

---

# **10. End-to-End Flow Summary**

```

Cloudflare: calculate top100 + merkle_root

Cloudflare: sign(snapshot_payload)

 ↓

submit_snapshot()

 ↓

Anchor verifies signature

 ↓

Store top100 + merkle_root

 ↓

Events fired

 ↓

Client UI + audits use this as authoritative leaderboard

```

---

# ✔️ **File #4 complete.**

