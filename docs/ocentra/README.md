# Ocentra Games Documentation

**Purpose:** Central documentation hub for Ocentra Games project. This README summarizes what exists, where to find detailed specs, and which phase document to follow based on current work.

**Strategy:** DRY (Don't Repeat Yourself) - Main README points to specific docs. Each doc is focused and self-contained. Navigate based on work phase, just like the [Multiplayer and Solana](./Multiplayer%20and%20Solana/README.md) documentation structure.

---

## Quick Start Guide

**New to the codebase?** → [REPO-MINDMAP.md](./REPO-MINDMAP.md) - Start here to understand the entire repository structure

**Working on a specific area? Jump directly:**

- **Game Mode Asset System** → [GameData/GameMode-Asset-System-Plan.md](./GameData/GameMode-Asset-System-Plan.md) (6-phase implementation plan)
- **AI/LLM Integration** → [AILogic/README.md](./AILogic/README.md)
- **Card Assets** → [GameData/cards.md](./GameData/cards.md)
- **Game Editor Tool** → [GameEditor/game-editor-system.md](./GameEditor/game-editor-system.md)
- **UI Structure** → [Architecture/UI-STRUCTURE-MAP.md](./Architecture/UI-STRUCTURE-MAP.md)
- **Game Rules** → [GameRules/README.md](./GameRules/README.md)
- **Multiplayer & Solana** → [Multiplayer and Solana/README.md](./Multiplayer%20and%20Solana/README.md)

---

## 1. Core Specs & References

Each section links to focused documentation. Read the relevant spec when working on that area.

### Game Mode Asset System
**Location:** `GameData/`

- **[GameMode-Asset-System-Plan.md](./GameData/GameMode-Asset-System-Plan.md)**
  - Implementation plan (6 phases)
  - Current state vs target state
  - Unity → Web mapping
  - Component checklist
  - **Read when:** Implementing GameMode asset system

- **[Unity-Asset-System-Analysis.md](./GameData/Unity-Asset-System-Analysis.md)**
  - Unity's nested asset pattern (parent-child assets)
  - How GameMode contains child BaseBonusRule assets
  - AIHelper prompt generation flow
  - Asset loading patterns (GameModeManager)
  - Web implementation mapping
  - **Read when:** Understanding Unity patterns or implementing asset manager

- **[cards.md](./GameData/cards.md)**
  - Card ScriptableObject assets
  - Deck singleton system
  - Card utilities (CardUtility, HandUtility)
  - Editor automation
  - **Read when:** Creating card assets or card-related systems

### Game Rules & Logic

- **[Rules/README.md](./Rules/README.md)** - Rules system documentation hub
  - **Status:** Planning Phase (after GameMode asset system)
  - Rules define game logic (move validation, score calculation, etc.)
  - After GameMode asset system, Rules will be extracted into separate `.asset` files (e.g., `claimRules.asset`)
  - Engine uses Rules for game logic. AI uses Rules for prompts.
  - **Read when:** Implementing Rules asset system (Phase 7) or understanding game logic

- **[Rules/rules-abstraction.md](./Rules/rules-abstraction.md)** (Legacy)
  - BaseBonusRule system architecture (for reference)
  - Rule evaluation and bonus calculation
  - **Note:** Will be migrated to Rules asset system (Phase 7)

- **[Gamemode/README.md](./Gamemode/README.md)** - GameMode documentation hub
  - **[game-modes.md](./Gamemode/game-modes.md)** - Overall GameMode architecture
  - **[gamemode-initialization-pattern.md](./Gamemode/gamemode-initialization-pattern.md)** - How GameMode initializes (TryInitialize, InitializeGameRules, etc.)
  - **[gamemode-ai-integration.md](./Gamemode/gamemode-ai-integration.md)** - How AIHelper uses GameMode for prompts
  - **[gamemode-network-usage.md](./Gamemode/gamemode-network-usage.md)** - Which GameMode properties are used for game configuration (TurnDuration, MaxRounds defaults)
  - **[gamemode-ui-usage.md](./Gamemode/gamemode-ui-usage.md)** - How UI screens use GameMode (RulesScreen, WelcomeScreen)
  - **[gamemode-editor-usage.md](./Gamemode/gamemode-editor-usage.md)** - How GameModeEditor works
  - **[gamemode-discovery-pattern.md](./Gamemode/gamemode-discovery-pattern.md)** - How GameModeManager discovers assets
  - **Read when:** Understanding game mode system, creating new game modes, or implementing GameMode features
  - **How to Create a New GameMode:** See [Gamemode/README.md](./Gamemode/README.md) - "How to Create a New GameMode" section

### AI System

- **[AILogic/README.md](./AILogic/README.md)** - AI Logic documentation hub
  - **[ai-prompt-construction.md](./AILogic/ai-prompt-construction.md)** - How AI prompts are built (Unity vs Web pattern)
  - **[ai-event-driven-pattern.md](./AILogic/ai-event-driven-pattern.md)** - Event-driven data sourcing for prompts
  - **[ai-provider-abstraction.md](./AILogic/ai-provider-abstraction.md)** - Provider abstraction (Unity vs Web)
  - **Important:** Unity uses its own AI system. Web uses a different AI system, but **prompting pattern** (using GameMode and Rules) stays the same.
  - **Read when:** Implementing AI/LLM integration or modifying prompt generation

### Game Editor

- **[GameEditor/game-editor-system.md](./GameEditor/game-editor-system.md)**
  - Editor UI and controls
  - How to save table layouts
  - File structure and state management
  - **Read when:** Using the editor or implementing editor features

### Architecture

- **[Architecture/event-driven-domains.md](./Architecture/event-driven-domains.md)**
  - Event-driven architecture pattern
  - Domain separation (UI, Engine, Solana, AI)
  - Cross-domain communication via events
  - **Key Principle:** All cross-domain communication is event-driven
  - **Read when:** Understanding system architecture or adding new domains

- **[Architecture/UI-STRUCTURE-MAP.md](./Architecture/UI-STRUCTURE-MAP.md)**
  - Current file structure
  - Application flow
  - Routing system plan
  - Match flow architecture
  - **Read when:** Working on UI structure, routing, or match flow

### Libraries (`@lib/`)

- **[Lib/README.md](./Lib/README.md)** - Library documentation hub
  - **[eventbus.md](./Lib/eventbus.md)** - EventBus system (cross-domain communication)
  - **[react-behaviours.md](./Lib/react-behaviours.md)** - ReactBehaviour system (lifecycle management)
  - **[serialization.md](./Lib/serialization.md)** - Serializable system (data persistence)
  - **[contracts.md](./Lib/contracts.md)** - Contract checking (runtime validation)
  - **[logging.md](./Lib/logging.md)** - Logging system (structured logging with IndexedDB)
  - **[core-utilities.md](./Lib/core-utilities.md)** - Core utilities (GUID, timeout, services)
  - **[crypto.md](./Lib/crypto.md)** - Cryptographic services (hashing, signing)
  - **[pipelines.md](./Lib/pipelines.md)** - ML pipelines (text generation, TTS, STT)
  - **[match-recording.md](./Lib/match-recording.md)** - Match recording system
  - **[db.md](./Lib/db.md)** - IndexedDB utilities
  - **Read when:** Need to use or understand a specific library

### Multiplayer & Solana

- **[Multiplayer and Solana/README.md](./Multiplayer%20and%20Solana/README.md)** - Multiplayer and Solana documentation hub
  - Solana blockchain integration
  - On-chain/off-chain state management
  - Match lifecycle and state synchronization
  - Leaderboard system
  - Wallet authentication
  - Cloudflare Worker integration
  - Phase-based implementation plan
  - **[examples/README.md](./Multiplayer%20and%20Solana/examples/README.md)** - Match record format examples
    - Example human vs human match records
    - Example AI vs AI match records with chain of thought
    - Chain of thought reasoning examples
    - **Use when:** Understanding MatchRecord format, implementing match recording, or developing replay features
  - **Read when:** Working on Solana integration, multiplayer features, or blockchain-related systems

---

## 2. Phase Map

### Game Mode Asset System Implementation

**Status:** ⏳ Planning Complete - Ready to Start

**Execution Order:**
1. **[Phase 01 – Core Serializable Foundation](Phases/phase-01-core-serializable-foundation.md)** (Not Started)
   - Make supporting classes Serializable
   - Foundation for asset system

2. **[Phase 02 – GameMode Base Refactor](Phases/phase-02-gamemode-base-refactor.md)** (Not Started)
   - Convert to data-driven
   - Replace methods with Serializable properties

3. **[Phase 03 – ClaimGameMode Refactor](Phases/phase-03-claimgamemode-refactor.md)** (Not Started)
   - Move hardcoded data to properties
   - Override initialization methods

4. **[Phase 04 – Asset Manager & Loading](Phases/phase-04-asset-manager-loading.md)** (Not Started)
   - Build scanning/loading system
   - Create GameModeAssetManager

5. **[Phase 05 – Asset File System](Phases/phase-05-asset-file-system.md)** (Not Started)
   - Create `.asset` files
   - Extend save API

6. **[Phase 06 – Integration & Migration](Phases/phase-06-integration-migration.md)** (Not Started)
   - Update consumers, test
   - End-to-end verification

### Rules Asset System Implementation

**Status:** ⏳ Planning Complete - Waiting for GameMode Asset System

**Prerequisites:** GameMode Asset System (Phases 1-6) must be complete

**Execution Order:**
7. **[Phase 07 – Rules Asset System](Phases/phase-07-rules-asset-system.md)** (Not Started)
   - Extract Rules from GameMode into separate `.asset` files
   - Create `claimRules.asset`, `pokerRules.asset`, etc.
   - GameMode references Rules assets
   - Engine uses Rules for game logic. AI uses Rules for prompts.

### AI Integration Implementation

**Status:** ⏳ Planning Complete - Waiting for Rules Asset System

**Prerequisites:** Rules Asset System (Phase 7) must be complete

**Execution Order:**
8. **[Phase 08 – AI Integration](Phases/phase-08-ai-integration.md)** (Not Started)
   - Integrate AI system with GameMode and Rules assets
   - Update AIHelper to use asset-based prompts
   - Ensure event-driven communication between AI and Engine domains

### UI Structure & Routing

**Status:** ⚠️ In Progress

**Current Phase:** Phase 2 (Routing Fix)
- Documents: [Architecture/UI-STRUCTURE-MAP.md](./Architecture/UI-STRUCTURE-MAP.md) - Phase 2 section

**Next Phase:** Phase 3 (Match Flow)
- Documents: [Architecture/UI-STRUCTURE-MAP.md](./Architecture/UI-STRUCTURE-MAP.md) - Phase 3 section

---

## 3. Reference Files

### Unity Reference Scripts
**Location:** `References/Scripts/OcentraAI/LLMGames/`

Key Unity files referenced in docs:
- `GameMode/CardGames/GameMode.cs` - Base GameMode class (see [Unity-Asset-System-Analysis.md](./GameData/Unity-Asset-System-Analysis.md))
- `GameMode/CardGames/ThreeCardGameMode.cs` - Example implementation (see [GameMode-Asset-System-Plan.md](./GameData/GameMode-Asset-System-Plan.md))
- `GameMode/CardGames/Rules/BaseBonusRule.cs` - Rule base class (see [Rules/rules-abstraction.md](./Rules/rules-abstraction.md))
- `LLMServices/AIHelper.cs` - AI prompt generation (see [AILogic/README.md](./AILogic/README.md))
- `GameMode/CardGames/ScriptableSingletons/Card.cs` - Card asset (see [GameData/cards.md](./GameData/cards.md))

### Web Implementation Files
**Location:** `src/`

Key implementation areas:
- `gameMode/` - GameMode classes (needs refactor for assets)
- `ai/` - AI system
- `ui/` - UI components and pages
- `lib/serialization/` - Serializable system

---

## 4. How to Work With This Plan

1. **Identify your work area** (Game Mode Assets, Rules, AI, Cards, Editor, UI, Multiplayer & Solana)
2. **Navigate to relevant spec** using quick links above
3. **Read the phase document** if working on phased implementation
4. **Reference Unity files** when implementing (docs point to specific Unity files)
5. **Follow phase order** - phases build on each other

**Example Workflow:**
- Working on Game Mode Asset System → Read [GameMode-Asset-System-Plan.md](./GameData/GameMode-Asset-System-Plan.md) → Start Phase 1 → Reference [Unity-Asset-System-Analysis.md](./GameData/Unity-Asset-System-Analysis.md) for Unity patterns
- Working on Phase 2 (GameMode base refactor) → Read [gamemode-initialization-pattern.md](./Gamemode/gamemode-initialization-pattern.md) for Step 3 → Read [gamemode-ai-integration.md](./Gamemode/gamemode-ai-integration.md) for Step 2 → Implement properties
- Working on AI integration → Read [AILogic/README.md](./AILogic/README.md) → Reference [gamemode-ai-integration.md](./Gamemode/gamemode-ai-integration.md) → Implement web version → Follow [phase-08-ai-integration.md](./Phases/phase-08-ai-integration.md)
- Working on game rules → Read [Rules/README.md](./Rules/README.md) → Follow [phase-07-rules-asset-system.md](./Phases/phase-07-rules-asset-system.md) → Reference Unity's `BaseBonusRule.cs` → Create rule system
- Working on UI structure → Read [Architecture/UI-STRUCTURE-MAP.md](./Architecture/UI-STRUCTURE-MAP.md) → Follow routing plan
- Working on game editor → Read [GameEditor/game-editor-system.md](./GameEditor/game-editor-system.md) → Understand editor workflow
- Working on Solana/multiplayer → Read [Multiplayer and Solana/README.md](./Multiplayer%20and%20Solana/README.md) → Follow phase-based implementation
- Creating a new GameMode → Read [Gamemode/README.md](./Gamemode/README.md) → Follow "How to Create a New GameMode" section

---

## 5. Documentation Structure

```
docs/ocentra/
├── README.md                         # ← You are here (main hub)
├── REPO-MINDMAP.md                   # Repository structure overview (start here if new to codebase)
│
├── Gamemode/                         # GameMode atomic docs
│   ├── README.md                         # GameMode hub (navigation)
│   ├── game-modes.md                     # Overall architecture
│   ├── gamemode-initialization-pattern.md    # Initialization flow
│   ├── gamemode-ai-integration.md            # AI usage
│   ├── gamemode-network-usage.md             # Game configuration usage
│   ├── gamemode-ui-usage.md                  # UI usage
│   ├── gamemode-editor-usage.md              # Editor pattern
│   └── gamemode-discovery-pattern.md         # Asset discovery
│
├── Phases/                           # Implementation phases
│   ├── phase-01-core-serializable-foundation.md
│   ├── phase-02-gamemode-base-refactor.md
│   ├── phase-03-claimgamemode-refactor.md
│   ├── phase-04-asset-manager-loading.md
│   ├── phase-05-asset-file-system.md
│   ├── phase-06-integration-migration.md
│   ├── phase-07-rules-asset-system.md      # Rules asset system (after GameMode)
│   └── phase-08-ai-integration.md          # AI Integration (after Rules)
│
├── AILogic/                          # AI Logic atomic docs
│   ├── README.md                         # AI Logic hub (navigation)
│   ├── ai-prompt-construction.md         # How prompts are built
│   ├── ai-event-driven-pattern.md        # Event-driven data sourcing
│   └── ai-provider-abstraction.md        # Provider abstraction
│
├── Rules/                             # Rules system docs
│   └── README.md                         # Rules system overview (planning phase)
│
├── Architecture/                      # Architecture docs
│   ├── event-driven-domains.md           # Event-driven architecture
│   └── UI-STRUCTURE-MAP.md               # UI structure and routing
│
├── GameData/                         # Game Mode Asset System
│   ├── GameMode-Asset-System-Plan.md    # Implementation plan (6 phases)
│   ├── Unity-Asset-System-Analysis.md   # Unity system analysis
│   └── cards.md                          # Card asset system
│
├── GameEditor/                       # Game Editor docs
│   └── game-editor-system.md            # Game editor tool
│
├── Multiplayer and Solana/           # Multiplayer & Solana docs
│   ├── README.md                         # Multiplayer & Solana hub
│   ├── architecture.md                   # System architecture
│   ├── wallet-auth-flow.md               # Wallet authentication
│   ├── state-layouts.md                  # State management
│   ├── leaderboard-anchor.md             # Leaderboard system
│   ├── phases/                           # Phase-based implementation
│   └── examples/                         # Match record format examples
│       ├── README.md                         # Examples documentation
│       ├── human_vs_human_match.json        # Example human vs human match
│       ├── ai_vs_ai_match.json              # Example AI vs AI match
│       └── chain_of_thought_example.json    # Chain of thought example
│
├── Lib/                               # Library documentation
│   ├── README.md                         # Library hub (navigation)
│   ├── eventbus.md                       # EventBus system
│   ├── react-behaviours.md               # ReactBehaviour system
│   ├── serialization.md                  # Serializable system
│   ├── contracts.md                      # Contract checking
│   ├── logging.md                        # Logging system
│   ├── core-utilities.md                 # Core utilities
│   ├── crypto.md                         # Cryptographic services
│   ├── pipelines.md                      # ML pipelines
│   ├── match-recording.md                # Match recording
│   └── db.md                             # IndexedDB utilities
│
└── Rules/                             # Rules system docs
    ├── README.md                         # Rules system overview (planning phase)
    └── rules-abstraction.md              # Rule system design (legacy, will migrate)
```

---

## 6. Current Active Work

**Primary Focus:** Game Mode Asset System (Phase 1)  
**Status:** Planning complete, ready for implementation

**Related Docs:**
- [GameData/GameMode-Asset-System-Plan.md](./GameData/GameMode-Asset-System-Plan.md) - Start here
- [GameData/Unity-Asset-System-Analysis.md](./GameData/Unity-Asset-System-Analysis.md) - Unity reference
- [Gamemode/README.md](./Gamemode/README.md) - GameMode atomic docs hub
- [Rules/rules-abstraction.md](./Rules/rules-abstraction.md) - For rule system
- [AILogic/README.md](./AILogic/README.md) - For AI integration

---

## 7. How to Create a New GameMode

**See:** [Gamemode/README.md](./Gamemode/README.md) - "How to Create a New GameMode" section

**Quick Steps:**
1. Create GameMode class extending `GameMode` base
2. Override initialization methods (InitializeGameRules, InitializeCardRankings, etc.)
3. Set game config properties (MaxPlayers, NumberOfCards, etc.)
4. Create `.asset` file with all game data
5. Add to manifest for discovery
6. Test loading and initialization

**Unity Pattern Reference:** [Gamemode/game-modes.md](./Gamemode/game-modes.md) - Concrete Implementation Example

---

**Last Updated:** 2025-01-20  
**Structure Pattern:** Based on [Multiplayer and Solana](./Multiplayer%20and%20Solana/README.md) organization (spec-driven, phase-based, DRY)
