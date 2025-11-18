# Treasury Multisig & Fee Structure

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2025-01-20

---

## Overview

This document defines the treasury multisig structure, fee parameters, and emergency controls for money matches. The treasury manages platform fees, withdrawal fees, and emergency pause controls.

---

## Treasury Multisig

### Recommended Solution: Squads v4

**Decision:** Use **Squads Protocol v4** for treasury multisig management.

**Rationale:**
- Solana-native multisig solution
- Battle-tested in production (used by major Solana projects)
- Supports flexible quorum requirements
- Easy rotation of signers
- Program-derived address (PDA) support

### Multisig Configuration

**Initial Setup:**
- **Signers:** 3-5 signers (recommended: 3 for devnet, 5 for mainnet)
- **Quorum:** 2-of-3 (devnet) or 3-of-5 (mainnet)
- **Signer Roles:**
  - **Platform Admin (1-2):** Primary platform operators
  - **Technical Lead (1):** Engineering lead with emergency access
  - **Finance Lead (1):** Financial operations oversight
  - **Legal/Compliance (1):** Compliance oversight (mainnet only)

### Multisig Operations

**Normal Operations:**
- Config updates require quorum signatures
- Fee parameter changes require quorum signatures
- Emergency pause/unpause requires quorum signatures

**Signer Rotation:**
1. Propose new signer via Squads UI
2. Existing signers approve (quorum required)
3. New signer added, old signer removed (if replacing)
4. Update on-chain `ConfigAccount.treasury_multisig` pubkey if multisig address changes

### Runbook: Creating Multisig on Devnet

1. **Install Squads CLI:**
   ```bash
   npm install -g @squads-io/squads-cli
   ```

2. **Create Multisig:**
   ```bash
   squads create-multisig \
     --network devnet \
     --threshold 2 \
     --signers <signer1-pubkey> <signer2-pubkey> <signer3-pubkey> \
     --name "Ocentra Treasury"
   ```

3. **Capture Multisig Address:**
   - Save the multisig address output
   - Store in secure password manager
   - Document in this runbook

4. **Fund Multisig:**
   ```bash
   solana transfer <multisig-address> 10 --allow-unfunded-recipient
   ```

5. **Update ConfigAccount:**
   - Use `update_config` instruction (see governance instructions)
   - Set `treasury_multisig` field to multisig address
   - Requires multisig signatures

6. **Test Operations:**
   - Test pause/unpause via multisig
   - Test config update via multisig
   - Verify quorum requirements

### Runbook: Mainnet Deployment

1. **Create Multisig on Mainnet:**
   - Use Squads UI or CLI with mainnet network flag
   - Use 3-of-5 quorum for mainnet
   - Include legal/compliance signer

2. **Security Audit:**
   - Review all signer keypairs (hardware wallets recommended)
   - Document key storage procedures
   - Set up key rotation schedule (quarterly review)

3. **Initial Funding:**
   - Transfer initial treasury funds via multisig
   - Document funding transaction signatures
   - Set up monitoring alerts

---

## Fee Structure

### Platform Fees

**Fee Type:** Basis points (bps) of entry fee  
**Default:** 500 bps (5%)  
**Stored in:** `ConfigAccount.platform_fee_bps` (u16)

**Calculation:**
```
platform_fee = (entry_fee * platform_fee_bps) / 10000
```

**Example:**
- Entry fee: 1 SOL (1,000,000,000 lamports)
- Platform fee: 5% = 50,000,000 lamports
- Prize pool: 950,000,000 lamports

### Withdrawal Fees

**Fee Type:** Fixed lamports per withdrawal  
**Default:** 5,000 lamports (0.000005 SOL)  
**Stored in:** `ConfigAccount.withdrawal_fee_lamports` (u64)

**Purpose:** Cover transaction costs and prevent spam withdrawals

**Applied To:**
- Platform custody withdrawals
- Self-custody withdrawals (optional, can be waived)

### Entry Fee Limits

**Minimum Entry Fee:**  
**Default:** 10,000 lamports (0.00001 SOL)  
**Stored in:** `ConfigAccount.min_entry_fee` (u64)

**Maximum Entry Fee:**  
**Default:** 100 SOL (100,000,000,000 lamports)  
**Stored in:** `ConfigAccount.max_entry_fee` (u64)

**Enforcement:**
- `create_match` instruction validates entry fee is within bounds
- Worker also validates before allowing match creation

---

## On-Chain ConfigAccount Fields

The `ConfigAccount` struct (see `programs/ocentra-games/src/state/config_account.rs`) includes the following treasury and fee fields:

```rust
pub struct ConfigAccount {
    // ... existing fields ...
    
    // Treasury multisig
    pub treasury_multisig: Pubkey,  // Squads v4 multisig address
    
    // Fee parameters
    pub platform_fee_bps: u16,              // Platform fee in basis points (500 = 5%)
    pub withdrawal_fee_lamports: u64,         // Fixed withdrawal fee
    pub min_entry_fee: u64,                  // Minimum entry fee per match
    pub max_entry_fee: u64,                   // Maximum entry fee per match
    
    // Emergency controls
    pub is_paused: bool,                      // Global pause flag
}
```

### Field Sizes

- `treasury_multisig`: 32 bytes (Pubkey)
- `platform_fee_bps`: 2 bytes (u16)
- `withdrawal_fee_lamports`: 8 bytes (u64)
- `min_entry_fee`: 8 bytes (u64)
- `max_entry_fee`: 8 bytes (u64)
- `is_paused`: 1 byte (bool, padded to 8 bytes for alignment)

**Total additional size:** 32 + 2 + 8 + 8 + 8 + 8 = 66 bytes

---

## Emergency Controls

### Pause Mechanism

**Purpose:** Emergency circuit breaker to halt all paid-match operations in case of:
- **Security vulnerability discovered** - Immediate pause to prevent exploitation
- **Economic exploit detected** - Someone finds a way to drain funds
- **Regulatory compliance issue** - Legal/compliance concern requiring immediate halt
- **Critical bug in payment logic** - Funds at risk, pause to prevent further damage
- **Planned maintenance/upgrade** - Scheduled downtime for system updates

**What is Pause/Unpause?**

Pause/unpause is an emergency control mechanism that allows the treasury multisig to temporarily disable all paid match operations. It acts as a **circuit breaker** - a safety switch that can instantly stop money-related operations if something goes wrong.

**Implementation:**
- `is_paused` boolean flag in `ConfigAccount` (defaults to `false` on initialization)
- `pause_program` instruction (requires multisig authority)
- `unpause_program` instruction (requires multisig authority)

**Who Can Pause/Unpause?**

Only the **treasury multisig** can pause or unpause the program. This prevents a single person from pausing the program and ensures emergency actions require consensus from multiple signers.

```rust
// Validate authority is treasury multisig
require!(
    ctx.accounts.authority.key() == config.treasury_multisig,
    GameError::Unauthorized
);
```

**What Operations Are Blocked?**

When `is_paused = true`, the following operations are blocked:

1. **`deposit_sol`** - Users cannot deposit SOL into platform custody
2. **`withdraw_sol`** - Users cannot withdraw SOL from platform custody
3. **`create_match` (paid matches only)** - Cannot create paid matches
4. **`join_match` (paid matches only)** - Cannot join paid matches
5. **`distribute_prizes`** - Cannot distribute prizes from escrow
6. **`refund_escrow`** - Cannot refund escrow funds

**Important:** Free matches continue to function normally. The pause mechanism only affects paid match operations.

**Enforcement:**

All paid-match instructions check the `is_paused` flag at the start of execution:

```rust
// Example from create_match.rs
if entry_fee_lamports > 0 {
    if let Some(config) = &ctx.accounts.config_account {
        require!(!config.is_paused, GameError::ProgramPaused);
    }
    // ... rest of paid match logic
}
```

If `is_paused = true`, instructions immediately return `GameError::ProgramPaused` with the message: "Program is paused - paid matches are temporarily disabled."

**Real-World Usage Example:**

```
1. Bug discovered: "Users can withdraw more than they deposited!"
2. Treasury multisig calls pause_program() (requires quorum signatures)
3. is_paused = true
4. All deposit/withdraw/create paid match operations fail immediately
5. Developers investigate and fix the bug
6. Treasury multisig calls unpause_program() (requires quorum signatures)
7. is_paused = false
8. Operations resume normally
```

**Error Code:**

When paused, instructions return:
- **Error Code:** `ProgramPaused` (6036)
- **Error Message:** "Program is paused - paid matches are temporarily disabled."

**Testing Considerations:**

In test environments, tests may share the same `ConfigAccount`. If one test pauses the program, subsequent tests will fail. Tests should ensure the config is unpaused before running:

```typescript
// After initializing config...
const config = await program.account.configAccount.fetch(configPDA);
if (config.isPaused) {
  await program.methods
    .unpauseProgram()
    .accounts({
      configAccount: configPDA,
      authority: authority.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
}
```

**Best Practices:**

1. **Pause Immediately** - Don't wait if you suspect a security issue
2. **Communicate Clearly** - Notify users when paused and why
3. **Fix Quickly** - Pause is temporary; fix the issue and unpause
4. **Document Everything** - Log pause/unpause actions in audit logs
5. **Test Regularly** - Practice pause/unpause procedures in devnet
6. **Monitor Closely** - Set up alerts for pause state changes

### Config Update Authority

**Authority:** Treasury multisig (via `treasury_multisig` pubkey)

**Updateable Fields:**
- `platform_fee_bps`
- `withdrawal_fee_lamports`
- `min_entry_fee`
- `max_entry_fee`
- `treasury_multisig` (for multisig rotation)

**Update Process:**
1. Propose config change via `update_config` instruction
2. Multisig signers approve (quorum required)
3. Transaction executes, config updated
4. Audit log entry created

### Migration Plan

**Scenario:** Treasury multisig needs to be rotated or upgraded

1. **Create New Multisig:**
   - Set up new Squads v4 multisig
   - Transfer signer roles as needed

2. **Update ConfigAccount:**
   - Use `update_config` instruction
   - Set `treasury_multisig` to new multisig address
   - Requires old multisig signatures (one-time migration)

3. **Verify Operations:**
   - Test pause/unpause with new multisig
   - Test config update with new multisig
   - Monitor for 24 hours

4. **Deprecate Old Multisig:**
   - Archive old multisig keys
   - Document migration in audit log

---

## Legal Ownership of Funds

### Platform Custody Funds

**Ownership:** Funds held in platform custody accounts are held in trust for users. Platform acts as custodian, not owner.

**Regulatory Status:**
- Platform is not a bank or money transmitter (users opt-in to custody)
- Funds are segregated (user balances tracked in Firebase)
- Platform does not commingle user funds with operational funds

### Escrow Funds

**Ownership:** Funds in escrow PDAs are held in trust for match participants. Platform fee is deducted before prize distribution.

**Distribution:**
- Winners receive prize pool (entry fees minus platform fee)
- Platform fee goes to treasury multisig
- Refunds go back to original payment source (wallet or platform custody)

### Chargeback Handling

**Stripe Chargebacks:**
1. **Detection:** Stripe webhook notifies platform
2. **Response:** Platform freezes user account
3. **Investigation:** Review match history, KYC status
4. **Resolution:**
   - Valid chargeback: Refund to Stripe, deduct from user balance
   - Invalid chargeback: Dispute via Stripe, maintain user balance
5. **Documentation:** Log in audit system

**Dispute Timeline:**
- Initial response: 7 days
- Full resolution: 30 days
- Escalation: Legal review if >$1000

---

## Related Documents

- `docs/Multiplayer and Solana/decisions.md` (ADR-008: Coordinator Wallet Security)
- `docs/Multiplayer and Solana/state-layouts.md` (ConfigAccount sizing)
- `docs/compliance/kyc-custody.md` (KYC tiers and custody model)
- `programs/ocentra-games/src/instructions/common/config/` (Governance instructions)

---

## Appendix: Squads v4 Resources

- **Documentation:** https://docs.squads.so/
- **CLI:** https://www.npmjs.com/package/@squads-io/squads-cli
- **UI:** https://app.squads.so/
- **Program ID:** `SQUADS_PROGRAM_ID` (see Squads docs for latest)

