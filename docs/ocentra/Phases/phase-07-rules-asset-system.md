# Phase 7: Rules Asset System

**Status:** ⏳ Not Started  
**Prerequisites:** GameMode Asset System (Phases 1-6) must be complete  
**Dependencies:** [Phase 06 - Integration & Migration](./phase-06-integration-migration.md)

---

## Objective

Extract Rules from GameMode into separate `.asset` files. Create `claimRules.asset`, `pokerRules.asset`, etc. GameMode will reference Rules assets instead of embedding rules directly. Engine uses Rules for game logic. AI uses Rules for prompts.

---

## Current State vs Target State

### Current State (Before Phase 7)

**Rules are embedded in GameMode:**
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

**Rules are separate assets:**
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

## Deliverables

1. ✅ `RulesAsset` base class (Serializable)
2. ✅ `ClaimRulesAsset` extends `RulesAsset`
3. ✅ Rules properties are Serializable
4. ✅ Rules logic moved from `ClaimGameMode` to `ClaimRulesAsset`
5. ✅ `ClaimGameMode` references `ClaimRulesAsset`
6. ✅ `public/GameMode/claimRules.asset` (JSON file)
7. ✅ Asset manager loads Rules assets
8. ✅ GameMode loads Rules when loaded
9. ✅ Engine continues using `GameMode.getGameRules()` (now loads from asset)
10. ✅ AI continues using `GameMode.getGameRules()` (now loads from asset)
11. ✅ UI continues using `GameMode.getGameRules().Player` (now loads from asset)

---

## Implementation Steps

### Step 1: Create Rules Asset Base

**Task:** Create `RulesAsset` base class that is Serializable.

**Files:**
- `src/gameMode/rules/RulesAsset.ts`
- Extends `Serializable` from `@lib/serialization`
- Base class for all rules assets

**Properties (Base):**
- `metadata` - Asset metadata (gameId, schemaVersion, etc.)
- `rules` - Rules container (LLM variant, Player variant)

**Checklist:**
- [ ] Create `RulesAsset` base class
- [ ] Mark as `@Serializable()`
- [ ] Add `metadata` property (Serializable)
- [ ] Add `rules` property (Serializable)
- [ ] Add `getRules()` method (returns rules)

**Reference:**
- [Phase 01 - Core Serializable Foundation](./phase-01-core-serializable-foundation.md) - How to make classes Serializable
- `@lib/serialization/Serializable.ts` - Serializable decorator

---

### Step 2: Create Game-Specific RulesAssets

**Task:** Create game-specific RulesAsset classes that extend `RulesAsset`.

**Files:**
- `src/gameMode/rules/ClaimRulesAsset.ts`
- `src/gameMode/rules/ThreeCardBragRulesAsset.ts`
- `src/gameMode/rules/TexasHoldemRulesAsset.ts`

**Properties:**
- All base properties from `RulesAsset`
- Game-specific rule properties

**Checklist:**
- [ ] Create `ClaimRulesAsset` class - See [GameRules/claim/README.md](../GameRules/claim/README.md)
- [ ] Create `ThreeCardBragRulesAsset` class - See [GameRules/threecard-brag/README.md](../GameRules/threecard-brag/README.md)
- [ ] Create `TexasHoldemRulesAsset` class - See [GameRules/texas-holdem/README.md](../GameRules/texas-holdem/README.md)
- [ ] Each extends `RulesAsset`
- [ ] Mark as `@Serializable()`
- [ ] Add game-specific rule properties per documentation
- [ ] Override `getRules()` if needed

**Reference:**
- [GameRules/claim/README.md](../GameRules/claim/README.md) - Claim rules specification (complete)
- [GameRules/threecard-brag/README.md](../GameRules/threecard-brag/README.md) - Three Card Brag rules specification (complete)
- [GameRules/texas-holdem/README.md](../GameRules/texas-holdem/README.md) - Texas Hold'em rules specification (complete)
- [Phase 03 - ClaimGameMode Refactor](./phase-03-claimgamemode-refactor.md) - Current Claim rules implementation (for reference)

---

### Step 3: Extract Rules from GameModes

**Task:** Move rule logic from each GameMode to corresponding RulesAsset.

**Files:**
- `src/gameMode/ClaimGameMode.ts` → `src/gameMode/rules/ClaimRulesAsset.ts`
- `src/gameMode/ThreeCardGameMode.ts` → `src/gameMode/rules/ThreeCardBragRulesAsset.ts`
- `src/gameMode/TexasHoldemGameMode.ts` → `src/gameMode/rules/TexasHoldemRulesAsset.ts`

**Steps (Repeat for each game):**
1. Identify all rule-related methods/properties in GameMode
2. Move them to corresponding RulesAsset (per game-specific documentation)
3. Update GameMode to reference RulesAsset
4. Update `GameMode.getGameRules()` to load from asset

**Checklist:**
- [ ] Extract Claim rules - See [GameRules/claim/README.md](../GameRules/claim/README.md) for specification
- [ ] Extract Three Card Brag rules - See [GameRules/threecard-brag/README.md](../GameRules/threecard-brag/README.md) for specification
- [ ] Extract Texas Hold'em rules - See [GameRules/texas-holdem/README.md](../GameRules/texas-holdem/README.md) for specification
- [ ] Update each GameMode to reference corresponding RulesAsset
- [ ] Update each `GameMode.getGameRules()` to use asset
- [ ] Test that rules still work for each game

**Reference:**
- [GameRules/README.md](../GameRules/README.md) - Rules system overview
- [GameRules/claim/README.md](../GameRules/claim/README.md) - Claim rules specification (complete, atomic)
- [GameRules/threecard-brag/README.md](../GameRules/threecard-brag/README.md) - Three Card Brag rules specification (complete, atomic)
- [GameRules/texas-holdem/README.md](../GameRules/texas-holdem/README.md) - Texas Hold'em rules specification (complete, atomic)

---

### Step 4: Create Rules Asset Files

**Task:** Create `.asset` files for Rules (JSON format) for each game.

**Files:**
- `public/GameMode/claimRules.asset` (JSON) - See [GameRules/claim/README.md](../GameRules/claim/README.md)
- `public/GameMode/threeCardBragRules.asset` (JSON) - See [GameRules/threecard-brag/README.md](../GameRules/threecard-brag/README.md)
- `public/GameMode/texasHoldemRules.asset` (JSON) - See [GameRules/texas-holdem/README.md](../GameRules/texas-holdem/README.md)

**Structure (Example - Claim):**
```json
{
  "metadata": {
    "gameId": "claim",
    "schemaVersion": 1,
    "displayName": "Claim Rules",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "rules": {
    "LLM": "Detailed rules for AI...",
    "Player": "Simple rules for players..."
  },
  "scoringSystem": {
    "type": "hoarders_multiplier",
    "sequenceCalculation": {...},
    "minimumShowdownPoints": 27
  },
  "moveValidity": {...},
  "strategyTips": [...],
  "gameFlow": {...}
}
```

**Checklist:**
- [ ] Create `claimRules.asset` (JSON) - Use [GameRules/claim/README.md](../GameRules/claim/README.md) as specification
- [ ] Create `threeCardBragRules.asset` (JSON) - Use [GameRules/threecard-brag/README.md](../GameRules/threecard-brag/README.md) as specification
- [ ] Create `texasHoldemRules.asset` (JSON) - Use [GameRules/texas-holdem/README.md](../GameRules/texas-holdem/README.md) as specification
- [ ] Populate each with game-specific rules from documentation
- [ ] Link from corresponding GameMode assets (GameMode references Rules)

**Reference:**
- [Phase 05 - Asset File System](./phase-05-asset-file-system.md) - Asset file format
- [GameRules/claim/README.md](../GameRules/claim/README.md) - Claim rules specification (complete structure)
- [GameRules/threecard-brag/README.md](../GameRules/threecard-brag/README.md) - Three Card Brag rules specification (complete structure)
- [GameRules/texas-holdem/README.md](../GameRules/texas-holdem/README.md) - Texas Hold'em rules specification (complete structure)
- `public/GameModeConfig/claim.json` - Current UI config format (reference)

---

### Step 5: Update Asset Manager

**Task:** Add Rules asset loading to asset manager.

**Files:**
- `src/gameMode/GameModeAssetManager.ts` (or similar)

**Steps:**
1. Add Rules asset loading to asset manager
2. Load Rules when loading GameMode
3. Cache Rules assets

**Checklist:**
- [ ] Add Rules asset loading to asset manager
- [ ] Load Rules when loading GameMode
- [ ] Cache Rules assets
- [ ] Handle missing Rules assets (fallback or error)

**Reference:**
- [Phase 04 - Asset Manager & Loading](./phase-04-asset-manager-loading.md) - Asset manager implementation
- [Gamemode/gamemode-discovery-pattern.md](../Gamemode/gamemode-discovery-pattern.md) - Asset discovery pattern

---

### Step 6: Update Consumers

**Task:** Ensure Engine, AI, UI still work with asset-based Rules.

**Files:**
- `src/engine/logic/RuleEngine.ts` - Uses `GameMode.getGameRules()`
- `src/ai/AIHelper.ts` - Uses `GameMode.getGameRules()` for prompts
- UI components - Use `GameMode.getGameRules().Player` for display

**Steps:**
1. Verify Engine uses `GameMode.getGameRules()` (should still work)
2. Verify AI uses `GameMode.getGameRules()` (should still work)
3. Verify UI uses `GameMode.getGameRules().Player` (should still work)

**Checklist:**
- [ ] Engine continues using `GameMode.getGameRules()` (works with assets)
- [ ] AI continues using `GameMode.getGameRules()` (works with assets)
- [ ] UI continues using `GameMode.getGameRules().Player` (works with assets)
- [ ] Test end-to-end: Engine validation, AI prompts, UI display

**Reference:**
- [AILogic/ai-prompt-construction.md](../AILogic/ai-prompt-construction.md) - How AI uses rules
- [Gamemode/gamemode-ai-integration.md](../Gamemode/gamemode-ai-integration.md) - GameMode AI integration

---

## Testing

### Unit Tests

- [ ] Test `RulesAsset` serialization/deserialization
- [ ] Test `ClaimRulesAsset` serialization/deserialization
- [ ] Test `GameMode.getGameRules()` loads from asset
- [ ] Test asset manager loads Rules assets

### Integration Tests

- [ ] Test Engine uses Rules from assets
- [ ] Test AI uses Rules from assets for prompts
- [ ] Test UI displays Rules from assets
- [ ] Test end-to-end: GameMode → Rules → Engine/AI/UI

### Manual Testing

- [ ] Load Claim game mode with Rules asset
- [ ] Verify Engine validates moves using Rules
- [ ] Verify AI generates prompts using Rules
- [ ] Verify UI displays rules correctly

---

## Exit Criteria

✅ All deliverables completed  
✅ All unit tests passing  
✅ All integration tests passing  
✅ Manual testing successful  
✅ Engine, AI, UI work with asset-based Rules  
✅ Documentation updated (Rules/README.md)

---

## Related Documentation

### Planning & Analysis
- [GameRules/README.md](../GameRules/README.md) - Rules system overview
- [GameRules/claim/README.md](../GameRules/claim/README.md) - Claim game rules specification (complete, atomic)
- [GameRules/threecard-brag/README.md](../GameRules/threecard-brag/README.md) - Three Card Brag rules specification (complete, atomic)
- [GameRules/texas-holdem/README.md](../GameRules/texas-holdem/README.md) - Texas Hold'em rules specification (complete, atomic)
- [GameData/GameMode-Asset-System-Plan.md](../GameData/GameMode-Asset-System-Plan.md) - GameMode asset system (prerequisite)

### GameMode Integration
- [Gamemode/gamemode-initialization-pattern.md](../Gamemode/gamemode-initialization-pattern.md) - How GameMode initializes (currently includes rules)

### AI Integration
- [AILogic/ai-prompt-construction.md](../AILogic/ai-prompt-construction.md) - How AI uses rules for prompts
- [Gamemode/gamemode-ai-integration.md](../Gamemode/gamemode-ai-integration.md) - How AIHelper uses GameMode properties

### Architecture
- [Architecture/event-driven-domains.md](../Architecture/event-driven-domains.md) - Event-driven architecture (Engine, AI, UI communicate via events)

### Phases
- [Phase 01 - Core Serializable Foundation](./phase-01-core-serializable-foundation.md) - Prerequisite
- [Phase 02 - GameMode Base Refactor](./phase-02-gamemode-base-refactor.md) - Prerequisite
- [Phase 03 - ClaimGameMode Refactor](./phase-03-claimgamemode-refactor.md) - Current Claim rules implementation
- [Phase 04 - Asset Manager & Loading](./phase-04-asset-manager-loading.md) - Asset manager (prerequisite)
- [Phase 05 - Asset File System](./phase-05-asset-file-system.md) - Asset files (prerequisite)
- [Phase 06 - Integration & Migration](./phase-06-integration-migration.md) - Prerequisite
- [Phase 08 - AI Integration](./phase-08-ai-integration.md) - Next phase (uses Rules assets)

---

**Last Updated:** 2025-01-20  
**Next Phase:** [Phase 08 - AI Integration](./phase-08-ai-integration.md)

