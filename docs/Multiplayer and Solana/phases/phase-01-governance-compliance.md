# Phase 01 – Governance & Compliance

## Objective

Define custody/KYC tiers, treasury ownership, and emergency controls so paid matches can move real money without violating policy or losing funds.

## Current Baseline

- User accounts in Firebase track gameplay metadata but have no custody or KYC attributes.
- Treasury flows are single-key (developer wallet) per `Anchor.toml` with no multisig requirement.
- Audit logging is limited to ad-hoc test output and Cloudflare Worker logs.

## Deliverables

1. **Custody & KYC model** documented in `docs/compliance/kyc-custody.md`, including tiers, opt-in flags, custody transfer of SOL, and linkage to user profiles.
2. **Treasury multisig** decision + runbook (e.g., Squads v4 vault) stored in `docs/compliance/treasury.md`, plus on-chain `config_account` fields for treasury pubkey and fee parameters.
3. **Emergency controls** instructions: pause flag, config update authority, and migration plan referencing Anchor instruction files.
4. **Audit logging spec** for Firebase/Firestore + Cloudflare logs with immutability guarantees and correlation IDs.

## Implementation Checklist

**Phase Status:** ⬜ Not Started | 🟡 In Progress | ✅ Complete

**⚠️ IMPORTANT:** If you encounter anything confusing, ambiguous, or unclear during implementation, STOP and ask the user (master) for clarification. Do not make assumptions.

### Deliverables Checklist
- [ ] Deliverable 1: Custody & KYC model documented in `docs/compliance/kyc-custody.md`
- [ ] Deliverable 2: Treasury multisig decision + runbook in `docs/compliance/treasury.md`
- [ ] Deliverable 3: Emergency controls instructions implemented
- [ ] Deliverable 4: Audit logging spec documented

### Implementation Steps
- [ ] **Step 1:** Draft custody tiers (`basic`, `enhanced`, `restricted`) and map them to Firebase `users/{uid}` documents with fields `kycTier`, `custodyOptIn`, `walletPubkey`, `platformFundsAllowed`.
- [ ] **Step 2:** Align fiat on/off ramps (e.g., Stripe) by defining legal ownership of funds, chargeback handling, and dispute resolution procedures.
- [ ] **Step 3:** Select a Solana-native multisig (Squads recommended) and document signer roles, quorum, and rotation steps.
- [ ] **Step 4:** Extend the on-chain `ConfigAccount` struct (see `programs/ocentra-games/src/state/config_account.rs`) with:
  - [ ] `treasury_multisig` pubkey
  - [ ] `platform_fee_bps`, `withdrawal_fee_lamports`, `min_entry_fee`, `max_entry_fee`
  - [ ] `is_paused` boolean
- [ ] **Step 5:** Add governance instructions (`pause_program`, `unpause_program`, `update_config`) in `instructions/common/config/` with checks that only the multisig authority can call them.
- [ ] **Step 6:** Define append-only audit logging strategy:
  - [ ] Firebase Cloud Functions write immutable ledger entries to `auditLogs/{docId}` with hash chaining.
  - [ ] Cloudflare Worker emits structured logs to R2 or Logpush with transaction signature references.
- [ ] **Step 7:** **After ANY code change in this phase:** Run full test suite: `anchor build && anchor test && cargo check && cargo fmt && pnpm lint && pnpm test`. This ensures Rust, Anchor, and TypeScript code stays in sync and passes all checks. Review existing merged work for this phase (keep changes additive) before starting.
- [ ] **Step 8:** If you're blocked on Solana/Anchor details, use the Solana Expert MCP tools (Solana Expert, Solana Docs Search, Anchor Expert) to get guidance before proceeding.

### Testing Checklist
- [ ] Anchor unit test: Attempt to invoke paid-match instructions while `is_paused = true` → expect failure
- [ ] TypeScript test: Verify config fetch + enforcement in match creation helpers
- [ ] Manual verification: Multisig signatures required for config updates (simulate via local validator + keypairs)

### Exit Criteria Checklist
- [ ] Custody/KYC docs reviewed by legal/compliance stakeholders
- [ ] Config account schema + governance instructions merged with accompanying tests
- [ ] Multisig created on devnet with signer list captured in runbook
- [ ] Audit logging pipeline design approved and blocked on Phase 06 implementation only
- [ ] All checkboxes above are checked ✅

## File & Module Impact

- `docs/compliance/kyc-custody.md`, `docs/compliance/treasury.md`
- `programs/ocentra-games/src/state/config_account.rs`
- `programs/ocentra-games/src/instructions/common/config/` (new directory)
- `tests/common/setup/` to ensure config + pause flags are respected
- Firebase security rules + Cloud Functions (`functions/src/audit-logger.ts` when added in Phase 06)

## Testing & Validation

- Anchor unit tests that attempt to invoke paid-match instructions while `is_paused = true` and expect failure.
- TypeScript tests verifying config fetch + enforcement in match creation helpers.
- Manual verification that multisig signatures are required for config updates (simulate via local validator + keypairs).

## Compliance & Risk Notes

- Document fraud/chargeback playbooks; include scenario tables for "Stripe dispute", "KYC mismatch", "suspicious volume".
- Define data retention durations for KYC documents per jurisdiction.
- Reference Solana best-practice guidance on admin authorities and halted programs (see [Solana Program Best Practices](https://solana.com/fi/docs/toolkit/best-practices)).

## Exit Criteria

- Custody/KYC docs reviewed by legal/compliance stakeholders.
- Config account schema + governance instructions merged with accompanying tests.
- Multisig created on devnet with signer list captured in runbook.
- Audit logging pipeline design approved and blocked on Phase 06 implementation only.

## Related Docs

- `docs/money-match-plan/architecture.md` for the high-level on/off-chain roles governance needs to cover.
- `docs/money-match-plan/architecture-diagram.md` when communicating custody entry points to stakeholders.
