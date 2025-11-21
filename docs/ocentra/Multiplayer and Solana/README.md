# Money-Match Implementation Plan

Use this README as the entry point for the paid-match initiative. It summarizes our current capabilities, the desired dual on/off-chain architecture, and where to find the detailed specs and phase plans that engineers (human or AI) should follow.

---

## Quick Start (Local Development)

**New here? Start with [`local-development-guide.md`](local-development-guide.md) for complete setup instructions.**

### TL;DR - Running Tests

```bash
# WSL - Start validator and deploy
cd /mnt/e/ocentra-games/Rust/ocentra-games
solana-test-validator --reset   # Terminal 1
anchor deploy                    # Terminal 2
```

```powershell
# Windows - Run tests (auto-initializes GameRegistry)
.\run-tests.ps1
```

### System Overview

```text
┌─────────────────┐         ┌─────────────────┐
│      WSL        │  RPC    │    Windows      │
│  (Solana)       │◄───────►│   (Game)        │
├─────────────────┤  :8899  ├─────────────────┤
│ • Validator     │         │ • TypeScript    │
│ • Anchor Deploy │         │ • Game Client   │
│ • Rust Tests    │         │ • E2E Tests     │
└─────────────────┘         └─────────────────┘
```

**Key Point:** Deploying the program uploads code only. You must also initialize the GameRegistry (once per network) before creating matches. The `run-tests.ps1` script handles this automatically.

---

## Guiding Principles

- **⚠️ CRITICAL: Ask Before Assuming** - If you (AI assistant) encounter anything confusing, ambiguous, or unclear, STOP and ask the user (master) for clarification. Do not make assumptions that could lead to incorrect implementation.

- **Money-match play is optional.** Users can play completely free without any Solana wallet or real money. The core game, benchmark modes, and leaderboards function regardless of whether paid stakes are enabled.
- **Solana wallet is optional even for money matches.** Players can:
  - Play free matches (no wallet needed)
  - Play money matches with custodial deposits (no wallet needed - platform manages funds)
  - Play money matches with self-custody wallet (optional - for users who prefer direct control)
- Paid and free matches share the same client UX; custody/KYC prompts appear only when a user opts into money matches.
- **All games use the same multiplayer architecture.** Even "single player" games (1 human vs AI) are built on the multiplayer framework - they're just 1 human vs 3-10 AI players depending on the game. The architecture is multiplayer by default.
- **Benchmark matches** can be all AI (no human players), no real money, but still stored on-chain/off-chain for trust, reliability, and verifiable AI performance tracking.
- Leaderboards, benchmarks, and analytics continue to operate for all players, with the top-100 anchoring and Merkle proofs covering both flows.
- **Storage strategy:** Off-chain (Durable Objects/D1) holds all match history, full leaderboard (>100k players), older games, and detailed records. On-chain (Solana) holds only recent/active matches, top-100 leaderboard snapshots, match result hashes, and escrow for money matches. See [`architecture.md`](architecture.md) for details.
- The on-chain and off-chain stacks run as a **dual parallel system**—both paths are always active. On-chain is primary source of truth when available, off-chain serves as fallback when Solana is unavailable or degraded. See [`decisions.md`](decisions.md) ADR-001 and ADR-004 for details.
- Every change must respect the organized file structure, test harnesses, and CI flows already documented in this package before landing future code.
- Shared fixtures under `test-data/` back Anchor, Worker, and UI tests; extend them (and keep them deterministic) whenever new scenarios require mock data.
- The off-chain Durable Object/D1 mirror described here has not been built yet—when implementing, ship the entire baseline (session management, escrow mirroring, fraud checks, queueing) rather than only money-match additions.
- If you run into Solana/Anchor questions, use the Solana Expert MCP tools (Solana Expert, Solana Docs Search, Anchor Expert) before guessing. If still unclear after using MCP tools, ask the user (master) for clarification.

---

## 1. Baseline vs Target

### Current Stack Snapshot

- **On-chain:** `Rust/ocentra-games/programs/ocentra-games` already exposes modular Anchor instructions with zero-copy match PDAs, hash anchoring, and replay protection. Storage layouts are summarized in [`state-layouts.md`](state-layouts.md).
- **Tooling & Tests:** `Rust/ocentra-games/tests` plus shared JSON fixtures (`test-data/`) provide cross-language determinism.
- **Off-chain Services:** `infra/cloudflare` hosts the Worker + Durable Object layer (`MatchCoordinatorDO`, etc.) that mirrors state and fans out real-time updates, deployed via Wrangler + GitHub Actions.

### Target End State

- Paid + free matches coexist with custody/KYC enforcement, described broadly in [`architecture.md`](architecture.md) and visually in [`architecture-diagram.md`](architecture-diagram.md).
- Wallet-funded and platform-funded paths both escrow entry fees and reconcile via the Worker + D1 schema (`cloudflare-worker.md`, `cloudflare-db-schema.md`).
- Governance, pause controls, and snapshot commitments live on-chain via the leaderboard Anchor layouts (`leaderboard-anchor.md`, `solana-anchor-leaderboard-snapshots.md`).
- Durable Objects + a shared Rust/WASM crate ensure deterministic math, Merkle roots, and Solana snapshot submissions (`rfc-onchain-offchain-system.md` ties the flow together).

---

## 2. Core Specs & References

### Getting Started (Read First!)

- [`local-development-guide.md`](local-development-guide.md): **🚀 START HERE** - Step-by-step guide for setting up local development, running tests, and understanding the WSL/Windows workflow. Includes troubleshooting and deployment instructions.

### Architecture & Design

- [`decisions.md`](decisions.md): **Architecture Decision Records (ADR)** - All major architectural decisions including state authority, token storage, payment methods, and system design choices.
- [`MultiplayerAndSolana.md`](MultiplayerAndSolana.md): authoritative end-to-end multiplayer + Solana spec that seeded this plan (canonical serialization, batching, anti-cheat, economic guardrails).
- [`architecture.md`](architecture.md): narrative on/off-chain split, responsibilities, and data flows.
- [`architecture-diagram.md`](architecture-diagram.md): ASCII diagram and flow walkthrough used in design/briefings.
- [`rfc-onchain-offchain-system.md`](rfc-onchain-offchain-system.md): requirements-level RFC describing trust model, APIs, and failure modes.

### Implementation Details

- [`cloudflare-worker.md`](cloudflare-worker.md): Worker/DO runtime responsibilities, APIs, lifecycle, fraud controls.
- [`cloudflare-db-schema.md`](cloudflare-db-schema.md): D1 schema + DO shard layouts backing the Worker.
- [`leaderboard-anchor.md`](leaderboard-anchor.md): Anchor account/instruction layout for on-chain leaderboard storage.
- [`solana-anchor-leaderboard-snapshots.md`](solana-anchor-leaderboard-snapshots.md): snapshot-focused Anchor project variant.

### Examples & Reference

- [`examples/README.md`](examples/README.md): Match record format examples and reference documentation
  - `human_vs_human_match.json` - Example human vs human match record
  - `ai_vs_ai_match.json` - Example AI vs AI match record with chain of thought
  - `chain_of_thought_example.json` - Detailed chain of thought reasoning example
  - **Use when:** Understanding MatchRecord format, implementing match recording, or developing replay features
- [`state-layouts.md`](state-layouts.md): sizing table for match, escrow, deposits, and config PDAs used across phases.

Read these once to understand the system boundaries, then jump into the phase you're implementing.

---

## 3. Phase Map (execution order & supporting specs)

Each phase lives under `docs/Multiplayer and Solana/phases/` and links back to the core specs above so the details stay DRY.

### Implementation Progress Tracker

**Status Legend:**
- ⬜ Not Started
- 🟡 In Progress
- ✅ Complete
- ⏸️ Blocked

**Execution Order:**
1. **On-Chain First:** Phases 01-04 must complete before off-chain work begins
2. **Off-Chain After:** Phase 08 (Off-chain Mirror) starts only after all on-chain phases (01-04) are complete
3. **Testing Per Phase:** Run full test suite (`anchor build`, `anchor test`, `cargo check`, `cargo fmt`, `pnpm lint`, `pnpm test`) after ANY code changes in that phase

| Phase | Status | Next Action | Blocked By |
|-------|--------|-------------|------------|
| **[Phase 01 – Governance & Compliance](phases/phase-01-governance-compliance.md)** | ✅ | Complete - Ready for legal/compliance review | None |
| **[Phase 02 – On-chain State Design](phases/phase-02-onchain-state.md)** | ✅ | Complete - All state structs implemented | None |
| **[Phase 03 – Economic Instructions](phases/phase-03-economic-instructions.md)** | ✅ | Complete - All economic instructions implemented | None |
| **[Phase 04 – Match Lifecycle Updates](phases/phase-04-match-lifecycle.md)** | ✅ | Complete - Paid match lifecycle integrated | None |
| **[Phase 05 – Client & UI](phases/phase-05-client-ui.md)** | ⬜ | Ready to start | None |
| **[Phase 06 – Backend & Firebase](phases/phase-06-backend-firebase.md)** | ⬜ | Ready to start | None |
| **[Phase 07 – Testing & CI](phases/phase-07-testing-ci.md)** | ⬜ | Can start in parallel with Phase 05-06 | None (parallel) |
| **[Phase 08 – Off-chain Mirror & WASM](phases/phase-08-offchain-mirror.md)** | ⬜ | Ready to start - All on-chain phases complete | None |
| **[Phase 09 – Monitoring & Operations](phases/phase-09-monitoring-ops.md)** | ⬜ | Wait for Phase 08 | Phase 08 |
| **[Phase 10 – Expansion Tracks](phases/phase-10-expansion-tracks.md)** | ⬜ | Optional, after all core phases | All core phases |

**Testing Requirements (Per Phase):**
After ANY code change in a phase, run the full test suite:
```bash
anchor build && anchor test && cargo check && cargo fmt && pnpm lint && pnpm test
```
This ensures Rust, Anchor, and TypeScript code stays in sync and passes all checks.

**To update progress:** Mark items complete in the phase document's checklist, then update status here.

### Phase Details

1. **[Phase 01 – Governance & Compliance](phases/phase-01-governance-compliance.md)**  
   Custody tiers, treasury multisig, emergency controls, audit logging. Relies on `architecture.md`, `architecture-diagram.md`, and downstream state/layout docs.

2. **[Phase 02 – On-chain State Design](phases/phase-02-onchain-state.md)**  
   Extends match/escrow/deposit PDAs, wired to the layouts in `state-layouts.md`, `leaderboard-anchor.md`, and `cloudflare-worker.md`.

3. **[Phase 03 – Economic Instructions](phases/phase-03-economic-instructions.md)** *(legacy outline; update once ready)*  
   Deposit, withdraw, prize distribution flows leveraging the same core specs.

4. **[Phase 04 – Match Lifecycle Updates](phases/phase-04-match-lifecycle.md)**  
   Injects payment methods into create/join/start/end instructions with references to `cloudflare-worker.md`, `architecture.md`, and leaderboard specs.

5. **[Phase 05 – Client & UI](phases/phase-05-client-ui.md)**  
   SDK + UI surfaces for custody balances, match creation toggles, leaderboard queries. Reads from Worker spec, DB schema, and architecture diagram.

6. **[Phase 06 – Backend & Firebase](phases/phase-06-backend-firebase.md)** *(legacy outline; update once ready)*  
   Firestore schema, Cloud Functions, Stripe/webhook glue built around the same architecture docs.

7. **[Phase 07 – Testing & CI](phases/phase-07-testing-ci.md)**  
   Rust + TS tests, WASM golden vectors, CI upgrades referencing `rfc-onchain-offchain-system.md`, `cloudflare-worker.md`, and `solana-anchor-leaderboard-snapshots.md`.

8. **[Phase 08 – Off-chain Mirror & WASM](phases/phase-08-offchain-mirror.md)**  
   Shared Rust/WASM crate, DO mirrors, reconciliation services grounded in `cloudflare-worker.md`, `cloudflare-db-schema.md`, `architecture.md`, and `architecture-diagram.md`.

9. **[Phase 09 – Monitoring & Operations](phases/phase-09-monitoring-ops.md)**  
   Metrics, alerts, runbooks informed by the architecture docs and Worker spec.

10. **[Phase 10 – Expansion Tracks](phases/phase-10-expansion-tracks.md)**  
    Optional expansion paths (tokens, tournaments, analytics, governance) that build on the baseline specs (`architecture.md`, `architecture-diagram.md`, Worker + Anchor docs).

Each phase doc already links back to the relevant specs; refer here to decide which one to open.

---

## 4. How to Work With This Plan

- Read Sections 1–2 once for context, then open the phase you're executing.
- Phase docs contain objectives, deliverables, file impact, testing expectations, and exit criteria—no code snippets so you can jump straight to the referenced files.
- Keep the canonical specs (`architecture*.md`, Worker/DB/Anchor docs, `state-layouts.md`) up to date so every phase remains DRY.
- When in doubt about serialization, anchoring, Merkle batching, disputes, or validator flows, defer to `MultiplayerAndSolana.md`; this README and the phase docs summarize its directives but do not replace the full spec.
- Wallet setup & Solana onboarding instructions from the deleted appendix are summarized here; if you still need the full step-by-step guide, recreate it locally or follow the CLI workflow described in our tooling docs.
- The legacy on-chain-only multiplayer flow is captured inside `MultiplayerAndSolana.md`—refer there when comparing the original architecture to the new dual-path system.
- When scope or sequencing changes, update this README and the affected phase doc so future contributors stay aligned.

## 5. Codebase Navigation for AI Assistants

**If you're an AI assistant (like Cursor) executing this plan:**

1. **Start with the phase document** (e.g., `phases/phase-02-onchain-state.md`) - it has the specific deliverables and file paths.

2. **Find the actual codebase files:**
   - Solana program: `Rust/ocentra-games/programs/ocentra-games/src/`
   - State structs: `Rust/ocentra-games/programs/ocentra-games/src/state/`
   - Instructions: `Rust/ocentra-games/programs/ocentra-games/src/instructions/`
   - Tests: `Rust/ocentra-games/tests/`
   - Cloudflare Workers: `infra/cloudflare/src/`
   - TypeScript SDK: Check for `src/` or `packages/` directories

3. **Read existing code first** to understand patterns:
   - Check existing state structs in `state/match_state.rs` to see current structure
   - Review existing instructions in `instructions/` to match coding style
   - Look at tests to understand expected behavior

4. **Reference the detailed specs:**
   - `state-layouts.md` has exact field sizes and layouts
   - `decisions.md` has architectural decisions (ADR-001, ADR-002, etc.)
   - `MultiplayerAndSolana.md` has comprehensive implementation details

5. **Use Solana Expert MCP tools** when stuck on Solana/Anchor specifics (mentioned in phase docs).

6. **Follow the implementation steps** in each phase doc - they're ordered and specific.

7. **CRITICAL: Stop and Ask for Clarification**
   - **If you encounter ANYTHING confusing, ambiguous, or unclear** - STOP immediately
   - **DO NOT make assumptions** - ask the user (master) for clarification
   - **Examples of when to stop:**
     - Unclear requirements or conflicting specifications
     - Missing information needed to proceed
     - Ambiguous file paths or code locations
     - Unclear error messages or unexpected behavior
     - Design decisions not covered in docs
     - Any situation where you're not 100% certain of the correct approach
   - **Better to ask than to guess** - incorrect assumptions waste time and create bugs

**Example workflow for Phase 02:**
- Read `phases/phase-02-onchain-state.md`
- Open `Rust/ocentra-games/programs/ocentra-games/src/state/match_state.rs` to see current `Match` struct
- Read `state-layouts.md` for exact field specifications
- Create new files as specified (e.g., `state/escrow.rs`)
- **After each code change:** Run full test suite: `anchor build && anchor test && cargo check && cargo fmt && pnpm lint && pnpm test`
- Check off completed items in the phase checklist

**Testing Requirements:**
- **Per Phase:** After ANY code change, run the full test suite to ensure Rust, Anchor, and TypeScript stay in sync
- **Before Committing:** All tests must pass (`anchor build`, `anchor test`, `cargo check`, `cargo fmt`, `pnpm lint`, `pnpm test`)
- **Phase Completion:** All checkboxes in the phase checklist must be checked before marking phase as complete

This structure keeps the high-level vision lightweight while letting builders dive into the right deep spec when needed.
