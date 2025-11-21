# Rules System Documentation Hub

**Purpose:** Documentation for the Rules asset system. Rules define game logic (how moves are validated, how scores are calculated, etc.). After GameMode asset system is complete, Rules will be extracted into separate `.asset` files (e.g., `claimRules.asset`).

**Strategy:** DRY - Each doc is focused and self-contained. Navigate based on what you're implementing.

**Status:** **Planning Phase** - Rules are currently embedded in GameMode. After GameMode asset system (Phases 1-6), Rules will be extracted into separate asset system (Phase 7).

---

## 📚 Quick Navigation

### Game-Specific Rules

Each game has its own folder with complete, atomic documentation:

- **[claim/README.md](./claim/README.md)** - Claim card game rules
  - Complete game rules (Hoarder's Multiplier scoring)
  - Unity GameMode/Rules implementation guide
  - Implementation checklist
  - **Read when:** Implementing Claim rules asset system

- **[threecard-brag/README.md](./threecard-brag/README.md)** - Three Card Brag rules
  - Complete game rules (hand rankings, betting, trump system)
  - Unity GameMode/Rules implementation guide
  - BaseBonusRule classes needed
  - Implementation checklist
  - **Read when:** Implementing Three Card Brag rules asset system

- **[texas-holdem/README.md](./texas-holdem/README.md)** - Texas Hold'em poker rules
  - Complete game rules (hand rankings, betting rounds, community cards)
  - Unity GameMode/Rules implementation guide
  - BaseBonusRule classes needed
  - Implementation checklist
  - **Read when:** Implementing Texas Hold'em rules asset system

### Overview
- **[rules-abstraction.md](./rules-abstraction.md)** - Rules system architecture and BaseBonusRule concepts

### Implementation Plans (Future)
- **Rules Asset System** - Phase 7 (after GameMode asset system)
  - Extract Rules from GameMode into separate `.asset` files
  - Create `claimRules.asset`, `threeCardBragRules.asset`, `texasHoldemRules.asset`, etc.
  - GameMode references Rules assets

---

## 🎯 Current State vs Target State

### Current State (Before Phase 7)

Rules are embedded in GameMode:
- `GameMode` contains rule logic directly
- `GameMode.getGameRules()` returns rules as properties
- Rules are initialized in `GameMode` initialization methods

**Example:**
```typescript
class ClaimGameMode extends GameMode {
  getGameRules() {
    return {
      LLM: "Claim game rules...",
      Player: "Simple rules for players..."
    }
  }
}
```

### Target State (After Phase 7)

Rules are separate assets:
- `claimRules.asset` - Contains Claim game rules
- `pokerRules.asset` - Contains Poker game rules
- `GameMode` references Rules asset (not embedded)

**Example:**
```typescript
class ClaimGameMode extends GameMode {
  rules: ClaimRulesAsset // References rules asset
  
  getGameRules() {
    return this.rules.getRules() // Load from asset
  }
}
```

---

## 🏗️ Key Concepts

### Rules Are Game Logic

**Purpose:** Rules define:
- **Move Validation:** What moves are valid in what states
- **Score Calculation:** How scores are calculated
- **Win Conditions:** What constitutes a win
- **Game Flow:** How the game progresses (turns, rounds, etc.)

**Used By:**
- **Engine Domain** (`src/engine/`) - Uses rules for game logic (validation, scoring, etc.)
- **AI Domain** (`src/ai/`) - Uses rules for AI prompts (move validity, strategies)
- **UI Domain** (`src/ui/`) - Uses rules for UI display (rule explanations)

### Rules Are Assets

**Pattern:** Similar to GameMode assets:
- Rules are Serializable
- Rules are stored as `.asset` files (JSON)
- Rules are loaded via asset manager
- GameMode references Rules assets

**Example Structure:**
```
public/GameMode/
├── claim.asset              # GameMode asset
├── claimRules.asset         # Rules asset (referenced by claim.asset)
├── threeCardBrag.asset      # GameMode asset
├── threeCardBragRules.asset # Rules asset (referenced by threeCardBrag.asset)
├── texasHoldem.asset        # GameMode asset
└── texasHoldemRules.asset   # Rules asset (referenced by texasHoldem.asset)
```

**Documentation Structure:**
```
docs/ocentra/GameRules/
├── README.md                   # This file (hub)
├── rules-abstraction.md        # Rules system architecture
├── claim/
│   └── README.md               # Claim game rules (atomic, complete)
├── threecard-brag/
│   └── README.md               # Three Card Brag rules (atomic, complete)
└── texas-holdem/
    └── README.md               # Texas Hold'em rules (atomic, complete)
```

---

## 🔄 Rules System Flow

### Current Flow (Before Phase 7)

```
GameMode (embedded rules)
  ↓
Engine uses GameMode.getGameRules()
  ↓
AI uses GameMode.getGameRules() for prompts
  ↓
UI uses GameMode.getGameRules().Player for display
```

### Target Flow (After Phase 7)

```
GameMode asset references Rules asset
  ↓
Rules asset loaded via asset manager
  ↓
GameMode.getGameRules() loads from Rules asset
  ↓
Engine uses GameMode.getGameRules()
  ↓
AI uses GameMode.getGameRules() for prompts
  ↓
UI uses GameMode.getGameRules().Player for display
```

---

## 📋 Implementation Plan (Phase 7)

### Prerequisites

- ✅ GameMode asset system complete (Phases 1-6)
- ✅ Rules currently embedded in GameMode
- ✅ Engine uses Rules for game logic
- ✅ AI uses Rules for prompts

### Tasks

1. **Create Rules Asset Base**
   - Create `RulesAsset` base class (Serializable)
   - Create game-specific RulesAsset classes (ClaimRulesAsset, ThreeCardBragRulesAsset, TexasHoldemRulesAsset)
   - Make Rules properties Serializable

2. **Extract Rules from GameMode**
   - Move rule logic from each GameMode to corresponding RulesAsset
   - Update GameMode classes to reference RulesAsset
   - Reference game-specific documentation: [claim/README.md](./claim/README.md), [threecard-brag/README.md](./threecard-brag/README.md), [texas-holdem/README.md](./texas-holdem/README.md)

3. **Create Rules Asset Files**
   - Create `public/GameMode/claimRules.asset` (JSON) - See [claim/README.md](./claim/README.md)
   - Create `public/GameMode/threeCardBragRules.asset` (JSON) - See [threecard-brag/README.md](./threecard-brag/README.md)
   - Create `public/GameMode/texasHoldemRules.asset` (JSON) - See [texas-holdem/README.md](./texas-holdem/README.md)
   - Link from corresponding GameMode assets (GameMode references Rules)

4. **Update Asset Manager**
   - Add Rules asset loading to asset manager
   - Load Rules when loading GameMode
   - Cache Rules assets

5. **Update Consumers**
   - Engine: Continue using `GameMode.getGameRules()` (now loads from asset)
   - AI: Continue using `GameMode.getGameRules()` (now loads from asset)
   - UI: Continue using `GameMode.getGameRules().Player` (now loads from asset)

6. **Test & Migrate**
   - Test Rules asset loading
   - Migrate existing rules to assets
   - Verify Engine, AI, UI still work

---

## 🔗 Related Documentation

### Main Hub
- [../README.md](../README.md) - Main ocentra documentation hub

### Game-Specific Rules Documentation
- [claim/README.md](./claim/README.md) - Claim card game rules and implementation guide
- [threecard-brag/README.md](./threecard-brag/README.md) - Three Card Brag rules and implementation guide
- [texas-holdem/README.md](./texas-holdem/README.md) - Texas Hold'em rules and implementation guide

### GameMode Integration
- [../GameData/GameMode-Asset-System-Plan.md](../GameData/GameMode-Asset-System-Plan.md) - GameMode asset system (prerequisite)
- [../Gamemode/gamemode-initialization-pattern.md](../Gamemode/gamemode-initialization-pattern.md) - How GameMode initializes (currently includes rules)

### AI Integration
- [../AILogic/ai-prompt-construction.md](../AILogic/ai-prompt-construction.md) - How AI uses rules for prompts
- [../Gamemode/gamemode-ai-integration.md](../Gamemode/gamemode-ai-integration.md) - How AIHelper uses GameMode properties

### Engine Integration
- `src/engine/logic/RuleEngine.ts` - Engine uses rules for game logic

### Architecture
- [../Architecture/event-driven-domains.md](../Architecture/event-driven-domains.md) - Event-driven architecture (Engine, AI, UI communicate via events)

### Phases
- [../Phases/phase-01-core-serializable-foundation.md](../Phases/phase-01-core-serializable-foundation.md) - Core Serializable (prerequisite)
- [../Phases/phase-02-gamemode-base-refactor.md](../Phases/phase-02-gamemode-base-refactor.md) - GameMode base refactor (prerequisite)
- [../Phases/phase-07-rules-asset-system.md](../Phases/phase-07-rules-asset-system.md) - Rules Asset System (this phase)

---

**Last Updated:** 2025-01-20  
**Status:** Planning Phase (after GameMode asset system)

