# Ocentra Games - Repository Mindmap

**Purpose:** High-level overview of the entire ocentra-games repository structure. This document explains what each folder does, why it exists, and how all components fit together.

**Target Audience:** New developers, AI assistants, contributors trying to understand the codebase

**Last Updated:** 2025-01-20

---

## 🎯 Quick Overview

**Ocentra Games** is a modern web-based card game platform built with:
- **Frontend:** React + TypeScript + Vite
- **Backend:** Solana Blockchain (Anchor/Rust) + Cloudflare Workers
- **AI:** Local LLMs (Transformers.js) + External LLM providers
- **Multiplayer:** Solana on-chain state + WebRTC P2P
- **Architecture:** Event-driven, domain-separated (UI, Engine, Solana, AI)

---

## 📁 Repository Structure

```
ocentra-games/
│
├── 📚 docs/ocentra/              # Complete documentation hub (DRY, spec-driven)
│
├── 💻 src/                       # Main TypeScript source code
│   ├── lib/                      # Core libraries (eventing, serialization, etc.)
│   ├── engine/                   # Game engine (logic, rules, state)
│   ├── gameMode/                 # Game mode system (Claim, ThreeCardBrag, etc.)
│   ├── ai/                       # AI system (LLM integration)
│   ├── services/                 # External services (Solana, Storage, etc.)
│   ├── ui/                       # React UI components and pages
│   ├── network/                  # P2P networking (WebRTC)
│   └── types/                    # TypeScript type definitions
│
├── 🦀 Rust/ocentra-games/        # Solana on-chain program (Anchor/Rust)
│   └── programs/ocentra-games/   # Anchor program source
│
├── 🧪 test-data/                 # Shared test fixtures (Rust + TS)
│
├── 🛠️ scripts/                   # Utility scripts (dev, testing, monitoring)
│
├── 📦 public/                    # Static assets (game configs, images)
│
└── ⚙️ Config files               # Build, lint, type configs
```

---

## 🏗️ Architecture Overview

### Three-Layer Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  React UI → EventBus → Game Engine → AI System         │
│              ↓              ↓            ↓              │
│          WebRTC P2P    Solana Client   Local LLM       │
└─────────────────────────────────────────────────────────┘
                        ↓         ↓
┌─────────────────────────────────────────────────────────┐
│                   BLOCKCHAIN LAYER                       │
│  Solana Network (Anchor Program)                        │
│  - Match State PDAs                                     │
│  - Escrow Accounts                                      │
│  - Leaderboard Snapshots                                │
│  - Game Registry                                        │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                    STORAGE LAYER                         │
│  Cloudflare R2 (Hot Storage)                           │
│  - Full match records                                   │
│  - Chain of thought                                     │
│  - Match history                                        │
└─────────────────────────────────────────────────────────┘
```

---

## 📚 Documentation (`docs/ocentra/`)

**Purpose:** Complete, DRY, spec-driven documentation hub

**Structure:**
- **[README.md](./README.md)** - Main documentation hub (navigation)
- **GameData/** - Game mode asset system planning
- **Gamemode/** - GameMode atomic documentation
- **GameRules/** - Rules system documentation (claim/, threecard-brag/, texas-holdem/)
- **AILogic/** - AI system documentation
- **Multiplayer and Solana/** - Solana integration docs + examples
- **Architecture/** - System architecture docs
- **Lib/** - Library documentation (@lib/ components)
- **Phases/** - Phase-based implementation plans

**Key Concept:** Follows DRY principle - main README links to atomic docs. Navigate based on work phase, just like Multiplayer and Solana docs.

**Read More:** [docs/ocentra/README.md](./README.md)

---

## 💻 Source Code (`src/`)

### Core Libraries (`src/lib/`)

**Purpose:** Reusable, domain-agnostic libraries

| Library | Purpose | Key Components |
|---------|---------|----------------|
| **eventing/** | Event-driven communication | EventBus, EventRegistrar, React hooks |
| **react-behaviours/** | React lifecycle management | ReactBehaviour, BehaviourHost, hooks |
| **serialization/** | Data persistence | Serializable decorator, serialize/deserialize |
| **contracts/** | Runtime validation | Interface checking, assertions |
| **logging/** | Structured logging | Logger, IndexedDB storage, query API |
| **match-recording/** | Match event collection | MatchEventCollector, canonical serialization |
| **pipelines/** | ML model integration | TextGeneration, TTS, STT pipelines |
| **crypto/** | Cryptographic services | Hashing, signing, key management |
| **db/** | IndexedDB utilities | BaseCRUD, schema management |
| **core/** | Core utilities | GUID generation, timeout, services |

**Documentation:** [docs/ocentra/Lib/README.md](./Lib/README.md)

---

### Game Engine (`src/engine/`)

**Purpose:** Game logic, rules, state management (domain: Engine)

**Components:**
- **GameEngine.ts** - Main game engine orchestrator
- **logic/** - Game logic components
  - `DeckManager.ts` - Deck shuffling, dealing
  - `RuleEngine.ts` - Rule validation
  - `ScoreCalculator.ts` - Score calculation (game-specific)
  - `StateValidator.ts` - State validation
  - `TurnManager.ts` - Turn management

**Communication:** Uses EventBus to communicate with UI, Solana, AI domains

**Read More:** See game-specific rules in [docs/ocentra/GameRules/](./GameRules/)

---

### Game Mode System (`src/gameMode/`)

**Purpose:** Game mode definitions (Claim, ThreeCardBrag, etc.)

**Components:**
- **GameMode.ts** - Base GameMode class (abstract)
- **ClaimGameMode.ts** - Claim game implementation
- **CardRanking.ts** - Card ranking system
- **GameRulesContainer.ts** - Rules container (LLM + Player versions)
- **GameModeFactory.ts** - Factory for creating game modes

**Status:** Currently embedded rules. Will migrate to asset-based system (Phase 7).

**Documentation:** 
- [docs/ocentra/Gamemode/README.md](./Gamemode/README.md) - GameMode system
- [docs/ocentra/GameRules/](./GameRules/) - Game-specific rules

---

### AI System (`src/ai/`)

**Purpose:** AI/LLM integration for AI players (domain: AI)

**Components:**
- **AIEngine.ts** - Main AI engine
- **AIHelper.ts** - Prompt construction (uses GameMode + Rules)
- **ModelManager.ts** - Model loading/management
- **ProviderManager.ts** - LLM provider abstraction
- **providers/** - LLM providers (OpenAI, LMStudio, Native, etc.)
- **match-recording/** - AI decision recording

**Key Features:**
- Local LLM support (Transformers.js)
- External LLM providers (OpenAI, OpenRouter, etc.)
- Chain of thought reasoning capture
- Event-driven data sourcing from Engine domain

**Documentation:** [docs/ocentra/AILogic/README.md](./AILogic/README.md)

**Communication:** Uses EventBus to communicate with Engine domain

---

### Services (`src/services/`)

**Purpose:** External service integrations

#### Solana Services (`src/services/solana/`)

**Components:**
- **MatchCoordinator.ts** - Main Solana coordinator
- **GameClient.ts** - Solana game client
- **AnchorClient.ts** - Anchor program client
- **TransactionHandler.ts** - Transaction handling
- **MerkleBatching.ts** - Merkle tree batching
- **BatchManager.ts** - Batch transaction management
- **wallet/** - Solana wallet integration

**Purpose:** Interface with Solana blockchain for:
- Match state management
- Escrow handling
- Leaderboard snapshots
- Game registry

**Documentation:** [docs/ocentra/Multiplayer and Solana/README.md](./Multiplayer%20and%20Solana/README.md)

#### Storage Services (`src/services/storage/`)

**Components:**
- **R2Service.ts** - Cloudflare R2 storage
- **HotStorageService.ts** - Hot storage abstraction

**Purpose:** Store full match records, chain of thought, match history

#### Verification Services (`src/services/verification/`)

**Components:**
- **MatchVerifier.ts** - Match verification
- **GameReplayVerifier.ts** - Game replay verification
- **DisputeResolver.ts** - Dispute resolution

**Purpose:** Verify match integrity, resolve disputes

---

### UI System (`src/ui/`)

**Purpose:** React UI components and pages (domain: UI)

**Structure:**
- **components/** - Reusable UI components
  - `game/` - Game-specific components (cards, tables, players)
  - `Auth/` - Authentication components
  - `Common/` - Common components (game cards, carousels)
  - `GameScreen/` - Game screen components
  - `MatchHistory/` - Match history components
- **pages/** - Page components
  - `games/` - Game pages (Claim, ThreeCardBrag)
  - `Home/` - Home page
  - `Settings/` - Settings page
  - `dev/` - Dev tools (editor, logs)
- **layout/** - UI layout system (table layouts, presets)
- **hooks/** - UI-specific hooks

**Communication:** Uses EventBus to communicate with Engine, Solana, AI domains

**Documentation:** [docs/ocentra/Architecture/UI-STRUCTURE-MAP.md](./Architecture/UI-STRUCTURE-MAP.md)

---

### Network (`src/network/`)

**Purpose:** P2P networking (WebRTC)

**Components:**
- **P2PManager.ts** - P2P manager
- **WebRTCHandler.ts** - WebRTC connection handling
- **connection/** - Connection management
- **hooks/** - React hooks for networking

**Purpose:** Direct peer-to-peer communication for real-time gameplay

---

## 🦀 Solana Program (`Rust/ocentra-games/`)

**Purpose:** On-chain game state and logic

### Structure

```
Rust/ocentra-games/
├── programs/ocentra-games/src/
│   ├── lib.rs                    # Main program entry
│   ├── instructions/             # Anchor instructions
│   │   ├── common/              # Common instructions (config, registry, etc.)
│   │   │   ├── config/          # Program configuration
│   │   │   ├── registry/        # Game registry
│   │   │   ├── economic/        # Economic instructions (deposits, withdrawals, etc.)
│   │   │   ├── batches/         # Batch operations
│   │   │   └── disputes/        # Dispute resolution
│   │   └── games/               # Game-specific instructions
│   │       ├── match_lifecycle/ # Match lifecycle (create, join, start, end)
│   │       └── moves/           # Move submission
│   ├── state/                    # On-chain state structs
│   │   ├── match_state.rs       # Match state PDA
│   │   ├── escrow.rs            # Escrow accounts
│   │   ├── game_registry.rs     # Game registry
│   │   ├── leaderboard.rs       # Leaderboard snapshots
│   │   └── ...
│   ├── games/                    # Game-specific logic
│   │   ├── claim/               # Claim game logic
│   │   │   ├── actions.rs       # Game actions
│   │   │   ├── rules.rs         # Game rules
│   │   │   └── validation.rs    # Move validation
│   │   └── dispatcher.rs        # Game dispatcher
│   └── card_games/               # Card game utilities
├── tests/                        # Anchor tests
└── Anchor.toml                   # Anchor configuration
```

**Key Features:**
- Match state PDAs (zero-copy accounts)
- Escrow management for paid matches
- Leaderboard snapshots (top 100)
- Game registry (register new games)
- Economic instructions (deposits, withdrawals, rewards)
- Batch operations (Merkle batching)
- Dispute resolution

**Documentation:** [docs/ocentra/Multiplayer and Solana/README.md](./Multiplayer%20and%20Solana/README.md)

---

## 🧪 Test Data (`test-data/`)

**Purpose:** Shared test fixtures used across Rust, TypeScript, and Cloudflare tests

**Structure:**
- **matches/** - Canonical match records (JSON format)
  - `claim-2player-minimal.json` - Minimal 2-player match
  - `claim-3player.json` - 3-player match
  - `claim-4player-complete.json` - Complete 4-player match
- **leaderboard/** - Leaderboard test data
  - `claim-top100.json` - Top 100 leaderboard entries
- **users/** - User test data
  - `sample-users.json` - Sample user accounts
- **games/** - Game registry test data
  - `registry.json` - Game registry entries
- **disputes/** - Dispute test data
  - `sample-dispute.json` - Sample dispute record
- **loaders.ts** - Test data loaders (used by Rust, TS, Cloudflare tests)

**Key Concept:** Same data used in all test layers ensures E2E consistency

**Data Flow:** `test-data/` → Rust Tests → Solana → Cloudflare → TypeScript Tests

**Documentation:** `test-data/README.md`

---

## 🛠️ Scripts (`scripts/`)

**Purpose:** Utility scripts for development, testing, and monitoring

**Scripts:**
- **dev.ts** - Development server (starts Vite dev server)
- **verify-matches.ts** - Match verification script (verifies match records from examples)
- **load-test/** - Load testing scripts
  - `concurrent-moves.ts` - Concurrent move submission tests
  - `create-1000-matches.ts` - Bulk match creation tests
  - `merkle-batching-benchmark.ts` - Merkle batching performance tests
  - `run-all.ts` - Run all load tests
- **measure-costs/** - Cost measurement scripts
  - `generate-cost-report.ts` - Generate cost analysis reports
  - `measure-batch-costs.ts` - Measure batch operation costs
  - `measure-transaction-costs.ts` - Measure transaction costs
- **monitoring/** - Monitoring scripts
  - `check-alerts.ts` - Check monitoring alerts
- **runallwith-solana-test.ps1** - PowerShell script to run tests with Solana
- **test-firebase.cjs** - Firebase test script
- **debug-auth.cjs** - Authentication debug script

---

## ☁️ Cloudflare Infrastructure (`infra/cloudflare/`)

**Purpose:** Cloudflare Worker backend for off-chain match handling, storage, and API

**Structure:**
- **src/** - Worker source code
  - `index.ts` - Main Worker entry point (HTTP router)
  - `auth.ts` - Firebase authentication
  - `monitoring.ts` - Metrics and alerting
  - `canonical.ts` - Canonical serialization
  - `ai-endpoint.ts` - AI endpoint handlers
  - `openapi.ts` - OpenAPI documentation
  - `durable-objects/**` - Durable Objects (MatchCoordinatorDO, etc.)
  - `templates/**` - HTML templates (explorer pages)
- **wrangler.toml** - Worker configuration (environments, bindings, routes)
- **api/openapi.yaml** - OpenAPI specification
- **package.json** - Worker dependencies
- **tsconfig.json** - TypeScript configuration

**Key Features:**
- R2 storage operations (upload/download match records)
- Match coordination via Durable Objects
- API endpoints for client access
- CORS handling (production: `game.ocentra.ca`, dev: `*`)
- Signed URL generation for R2
- Automated CI/CD deployment (GitHub Actions)

**Environments:**
- **Development:** `claim-storage-dev` → R2 bucket: `claim-matches-test`
- **Production:** `claim-storage` → R2 bucket: `claim-matches`

**Documentation:** 
- `infra/cloudflare/README.md` - Cloudflare Worker documentation
- [docs/ocentra/Multiplayer and Solana/cloudflare-worker.md](./Multiplayer%20and%20Solana/cloudflare-worker.md)

---

## 🔧 Tools (`tools/`)

**Purpose:** Standalone utility tools for match operations

**Tools:**
- **canonicalize.ts** - Canonical JSON serialization tool
- **upload-match.ts** - Upload match record to R2
- **verify-match.ts** - Verify match record integrity

**Use Case:** CLI tools for manual match operations, testing, and debugging

---

## 📖 References (`References/`)

**Purpose:** Unity reference scripts (for reference only, not used in web implementation)

**Structure:**
- **Scripts/OcentraAI/LLMGames/** - Unity game implementation
  - `GameMode/` - Unity GameMode classes (for reference)
  - `LLMServices/` - Unity AI system (for reference)
  - `Managers/` - Unity managers (for reference)
  - `UI/` - Unity UI (for reference)
  - `Networking/` - Unity networking (for reference - **Note:** Web uses Solana, not Unity multiplayer)

**Key Concept:** These are Unity scripts used as reference for implementing the web version. They show:
- Unity's ScriptableObject asset system (mapped to `.asset` files in web)
- Unity's BaseBonusRule system (mapped to Rules assets in web)
- Unity's AIHelper prompt generation (pattern mapped to web AI system)
- Unity's GameMode structure (mapped to web GameMode classes)

**Documentation:** 
- [docs/ocentra/GameData/Unity-Asset-System-Analysis.md](./GameData/Unity-Asset-System-Analysis.md)
- [docs/ocentra/Gamemode/](./Gamemode/) - Unity patterns mapped to web

**Important:** Unity multiplayer system is for reference only. Web uses Solana for all multiplayer/single-player.

---

## 📦 Public Assets (`public/`)

**Purpose:** Static assets served to client

**Structure:**
- **GameModeConfig/** - Game mode configuration files (JSON)
  - `claim.json` - Claim game config (current UI config format)
- **assets/** - Images, fonts, card assets
  - `cards/` - Card images
  - `fonts/` - Font files
  - Game-specific images (Claim, ThreeCardBrag, etc.)
  - Auth, Avatars, BgCards, etc.
- **vite.svg** - Vite logo

**Future:** Game mode `.asset` files will be stored here (Phase 5: Asset File System)

**Current State:** Uses `GameModeConfig/claim.json` for UI config

**Target State:** Will use `.asset` files for complete game mode data (assets, rules, etc.)

---

## ⚙️ Configuration Files

### Root Level Configs

| File | Purpose |
|------|---------|
| **package.json** | NPM dependencies and scripts |
| **tsconfig.json** | TypeScript configuration |
| **vite.config.ts** | Vite build configuration |
| **vitest.config.ts** | Vitest test configuration |
| **playwright.config.ts** | Playwright E2E test config |
| **eslint.config.js** | ESLint linting rules |

### Environment Files

| File | Purpose |
|------|---------|
| **.env.example** | Environment variable template |
| **.env** | Local environment variables (gitignored) |

---

## 🔄 Data Flow

### Match Creation Flow

```
UI (Create Match)
  ↓ EventBus
Engine (Validate)
  ↓ EventBus
Solana Service (Create Match PDA)
  ↓ Solana Transaction
Solana Network (On-chain State)
  ↓
R2 Storage (Full Match Record)
```

### Gameplay Flow

```
Player Action (UI)
  ↓ EventBus
Engine (Validate Move)
  ↓ EventBus
Solana Service (Submit Move)
  ↓ Solana Transaction
Solana Network (Update State)
  ↓
R2 Storage (Append Move)
```

### AI Decision Flow

```
Engine (Request AI Decision)
  ↓ EventBus
AI System (Generate Decision)
  ↓ LLM Call
AI System (Return Decision)
  ↓ EventBus
Engine (Apply Decision)
  ↓ EventBus
UI (Update Display)
```

---

## 🎯 Key Concepts

### Event-Driven Architecture

**Principle:** All cross-domain communication is event-driven via EventBus

**Domains:**
- **UI Domain** - React components and pages
- **Engine Domain** - Game logic and state
- **Solana Domain** - Blockchain integration
- **AI Domain** - AI/LLM integration

**Documentation:** [docs/ocentra/Architecture/event-driven-domains.md](./Architecture/event-driven-domains.md)

### Asset-Based Game Modes

**Concept:** Game modes and rules stored as `.asset` files (JSON), similar to Unity's ScriptableObject system

**Status:** Planning phase - will be implemented in phases 1-7

**Documentation:** 
- [docs/ocentra/GameData/GameMode-Asset-System-Plan.md](./GameData/GameMode-Asset-System-Plan.md)
- [docs/ocentra/Phases/](./Phases/) - Phase-based implementation

### Multiplayer Architecture

**Concept:** All games use multiplayer architecture, even single-player (1 human + AI players)

**Stack:**
- **Solana** - On-chain state, escrow, leaderboards
- **WebRTC** - P2P real-time communication
- **Cloudflare R2** - Off-chain full match records

**Documentation:** [docs/ocentra/Multiplayer and Solana/README.md](./Multiplayer%20and%20Solana/README.md)

---

## 📖 Documentation Structure

### Main Entry Points

1. **[docs/ocentra/README.md](./README.md)** - Start here
   - Navigation hub
   - Quick links to all documentation
   - Phase map

2. **[docs/ocentra/Multiplayer and Solana/README.md](./Multiplayer%20and%20Solana/README.md)** - Solana integration
   - Architecture overview
   - Phase-based implementation
   - Local development guide

3. **Game-Specific Rules:**
   - [docs/ocentra/GameRules/claim/README.md](./GameRules/claim/README.md) - Claim game rules
   - [docs/ocentra/GameRules/threecard-brag/README.md](./GameRules/threecard-brag/README.md) - Three Card Brag rules
   - [docs/ocentra/GameRules/texas-holdem/README.md](./GameRules/texas-holdem/README.md) - Texas Hold'em rules

### Library Documentation

All `@lib/` components documented in [docs/ocentra/Lib/](./Lib/):
- [eventbus.md](./Lib/eventbus.md) - Event system
- [serialization.md](./Lib/serialization.md) - Serialization
- [react-behaviours.md](./Lib/react-behaviours.md) - React behaviours
- [match-recording.md](./Lib/match-recording.md) - Match recording
- And more...

---

## 🚀 Getting Started

### 1. New to the Codebase?

**Read:**
1. This document (REPO-MINDMAP.md) - Understand overall structure
2. [docs/ocentra/README.md](./README.md) - Navigation hub
3. [docs/ocentra/Multiplayer and Solana/local-development-guide.md](./Multiplayer%20and%20Solana/local-development-guide.md) - Setup guide

### 2. Working on a Specific Feature?

**Identify your work area:**
- **Game Rules** → [docs/ocentra/GameRules/](./GameRules/)
- **Game Mode Assets** → [docs/ocentra/GameData/](./GameData/)
- **AI System** → [docs/ocentra/AILogic/](./AILogic/)
- **Solana Integration** → [docs/ocentra/Multiplayer and Solana/](./Multiplayer%20and%20Solana/)
- **UI Components** → [docs/ocentra/Architecture/UI-STRUCTURE-MAP.md](./Architecture/UI-STRUCTURE-MAP.md)
- **Library Usage** → [docs/ocentra/Lib/](./Lib/)

### 3. Implementing a Phase?

**Follow phase documents:**
- [docs/ocentra/Phases/](./Phases/) - Game mode asset system phases
- [docs/ocentra/Multiplayer and Solana/phases/](./Multiplayer%20and%20Solana/phases/) - Solana integration phases

---

## 🔗 Quick Reference

### Folder Purpose Summary

| Folder | Purpose | Key Files |
|--------|---------|-----------|
| **src/lib/** | Core libraries | EventBus, serialization, logging |
| **src/engine/** | Game engine | GameEngine, RuleEngine, ScoreCalculator |
| **src/gameMode/** | Game modes | GameMode, ClaimGameMode |
| **src/ai/** | AI system | AIEngine, AIHelper, ModelManager |
| **src/services/solana/** | Solana integration | MatchCoordinator, GameClient |
| **src/services/storage/** | Storage | R2Service, HotStorageService |
| **src/ui/** | React UI | Components, pages, hooks |
| **src/network/** | P2P networking | P2PManager, WebRTCHandler |
| **Rust/ocentra-games/** | Solana program | Anchor instructions, state structs |
| **test-data/** | Test fixtures | Shared test data for all layers |
| **docs/ocentra/** | Documentation | Complete spec-driven docs |

### Common Entry Points

**Development:**
- **Start Dev Server:** `npm run dev` (starts Vite dev server)
- **Type Check:** `npm run type-check`
- **Lint:** `npm run lint`
- **Format:** `npm run format`

**Testing:**
- **Run Tests:** `npm test` (Vitest)
- **Watch Tests:** `npm run test:watch`
- **E2E Tests:** `npm run test:e2e` (Playwright)
- **Run Solana Tests:** `cd Rust/ocentra-games && anchor test`
- **Verify Matches:** `npm run verify-matches`

**Building:**
- **Build:** `npm run build` (Vite build)
- **Preview:** `npm run preview` (preview production build)

**Solana Development:**
- **Start Validator:** `cd Rust/ocentra-games && solana-test-validator --reset`
- **Deploy Program:** `cd Rust/ocentra-games && anchor deploy`
- **Run Tests:** `cd Rust/ocentra-games && anchor test`

**Cloudflare Development:**
- **Local Dev:** `cd infra/cloudflare && npm run dev`
- **Deploy Worker:** `cd infra/cloudflare && npm run deploy` (manual - usually auto via CI/CD)

---

## 📝 Notes

- **DRY Principle:** Documentation follows DRY - main READMEs link to atomic docs
- **Phase-Based:** Implementation follows phase-based approach (see Phases/ folders)
- **Spec-Driven:** All features have specs before implementation
- **Event-Driven:** All cross-domain communication via EventBus
- **Multiplayer First:** All games use multiplayer architecture

---

**Last Updated:** 2025-01-20  
**Maintained By:** Ocentra Games Team

