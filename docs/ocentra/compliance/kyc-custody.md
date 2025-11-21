# KYC & Custody Model

**Version:** 1.0  
**Status:** Draft  
**Last Updated:** 2025-01-20

---

## Overview

This document defines the Know Your Customer (KYC) tiers and custody model for money matches. All money-match features are **optional**—users can play completely free without any Solana wallet or real money. The core game, benchmark modes, and leaderboards function regardless of whether paid stakes are enabled.

---

## Custody Tiers

### Tier Definitions

| Tier | Name | Description | Requirements | Limits |
|------|------|-------------|--------------|--------|
| `none` | No KYC | Default for all users | None | Free matches only |
| `basic` | Basic KYC | Email verification + phone | Email + SMS verification | Entry fees ≤ 0.1 SOL, daily deposit ≤ 1 SOL |
| `enhanced` | Enhanced KYC | Identity verification | Government ID + address proof | Entry fees ≤ 10 SOL, daily deposit ≤ 50 SOL |
| `restricted` | Restricted | Manual review required | Enhanced KYC + manual approval | Custom limits per user |

### Tier Progression

- Users start at `none` tier by default
- Opt-in to `basic` tier via email + phone verification
- Upgrade to `enhanced` tier by submitting identity documents
- `restricted` tier is assigned by platform administrators for high-risk or high-value accounts

---

## Firebase User Schema

Each user document in Firebase (`users/{uid}`) includes the following custody/KYC fields:

```typescript
interface UserCustodyFields {
  // KYC Tier
  kycTier: 'none' | 'basic' | 'enhanced' | 'restricted';
  kycVerifiedAt: number | null; // Unix timestamp
  kycExpiresAt: number | null; // Unix timestamp (null = no expiry)
  
  // Custody Opt-In
  custodyOptIn: boolean; // User has opted into money matches
  custodyOptInAt: number | null; // Unix timestamp
  
  // Wallet Information
  walletPubkey: string | null; // Self-custody wallet pubkey (if user connects wallet)
  walletConnectedAt: number | null; // Unix timestamp
  
  // Platform Custody
  platformFundsAllowed: boolean; // User allows platform to manage funds (custodial deposits)
  platformBalanceLamports: number; // Current platform custody balance (in lamports)
  
  // Limits (enforced by Worker)
  dailyDepositLimitLamports: number; // Daily deposit limit based on tier
  dailyWithdrawalLimitLamports: number; // Daily withdrawal limit based on tier
  maxEntryFeeLamports: number; // Maximum entry fee per match based on tier
}
```

### Default Values

- `kycTier`: `'none'`
- `custodyOptIn`: `false`
- `walletPubkey`: `null`
- `platformFundsAllowed`: `false`
- `platformBalanceLamports`: `0`
- Limits: Set based on tier (see Tier Definitions table)

---

## Payment Methods

Users can participate in money matches via two payment methods:

### 1. Self-Custody Wallet (`wallet`)

- User connects their own Solana wallet (e.g., Phantom, Solflare)
- User signs transactions directly
- Funds are held in user's wallet until escrow
- **No platform custody required**
- **No KYC required for wallet-funded matches** (per ADR-003, but Worker may enforce limits)

### 2. Platform Custody (`platform`)

- User deposits funds via fiat/card (Stripe integration)
- Platform manages a custodial wallet on user's behalf
- User does not need a Solana wallet
- **Requires KYC tier `basic` or higher**
- Funds are held in platform custody account until escrow

### Payment Method Constraints

Per **ADR-003**: All players in a match **MUST** use the same payment method. Mixed-payment matches are **NOT** supported.

---

## KYC Enforcement Points

Per **ADR-006**, KYC tier checks occur at specific enforcement points:

| Action | Check Point | Enforced By | On Fail |
|--------|-------------|-------------|---------|
| Deposit | Before transfer | Worker | Reject + notify |
| Create Match | If paid | Worker | Reject |
| Join Match | Before escrow | Worker | Reject |
| Withdraw | Before release | Worker + Chain | Hold + review |

### KYC Expiry Handling

- **Grace period:** 7 days after expiry
- **During grace:** Can play but not withdraw
- **After grace:** Account frozen until re-verified

---

## Custody Transfer of SOL

### Self-Custody Flow

1. User connects wallet → `walletPubkey` stored in Firebase
2. User creates/joins paid match → Signs transaction with wallet
3. SOL transferred from user wallet to escrow PDA
4. No platform involvement in custody

### Platform Custody Flow

1. User opts into platform custody → `platformFundsAllowed: true`
2. User deposits via Stripe → Funds converted to SOL, held in platform custody account
3. User creates/joins paid match → Platform signs transaction on user's behalf
4. SOL transferred from platform custody account to escrow PDA
5. Platform manages user's balance in Firebase (`platformBalanceLamports`)

### Custody Account Structure

- **Platform custody account:** Single wallet managed by platform, tracks user balances in Firebase
- **User deposit account (on-chain):** Optional PDA per user for self-custody tracking (see `UserDepositAccount` in `state-layouts.md`)

---

## Linkage to User Profiles

### Firebase Integration

- All custody/KYC data stored in `users/{uid}` document
- Security rules enforce read/write permissions:
  - Users can read their own custody data
  - Only platform services can write custody data
  - KYC verification status is read-only for users

### On-Chain Integration

- User's wallet pubkey (if self-custody) stored in Firebase only
- On-chain `UserAccount` PDA stores gameplay aggregates (lifetime_gp_earned, games_played) but **NOT** custody balances
- Custody balances are tracked in Firebase (platform custody) or user's wallet (self-custody)

---

## Compliance & Risk Management

### Fraud Prevention

- **Suspicious activity detection:** Monitor for unusual deposit/withdrawal patterns
- **Chargeback handling:** Documented in dispute resolution procedures (see `treasury.md`)
- **KYC mismatch:** Freeze account, require re-verification

### Data Retention

- KYC documents retained per jurisdiction requirements:
  - **US:** 5 years after account closure
  - **EU:** 5 years per GDPR/AML requirements
  - **Other:** Per local regulations
- Document storage: Encrypted, access-controlled, audit-logged

### Dispute Resolution

- Disputes handled via on-chain dispute system (see `instructions/common/disputes/`)
- Invalid disputes result in GP forfeiture (100 GP)
- Valid disputes paid from platform treasury

---

## Related Documents

- `docs/Multiplayer and Solana/decisions.md` (ADR-003, ADR-006)
- `docs/Multiplayer and Solana/state-layouts.md` (UserDepositAccount schema)
- `docs/compliance/treasury.md` (Treasury multisig and fee structure)

