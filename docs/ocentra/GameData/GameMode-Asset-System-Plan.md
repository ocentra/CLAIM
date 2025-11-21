# GameMode Asset System Implementation Plan

**Purpose:** Implement Unity-like ScriptableObject asset system for GameMode data-driven architecture, where game rules, AI configuration, layout references, and all game data are stored in `.asset` files (JSON format) that can be loaded/saved like Unity's ScriptableObject assets.

**Goal:** Replace hardcoded game logic with data-driven `.asset` files that contain all game configuration, rules, AI params, layout paths, etc.

**Related Documents:**
- **[../README.md](../README.md)** - Main ocentra documentation hub
- **[Unity-Asset-System-Analysis.md](./Unity-Asset-System-Analysis.md)** - Unity system deep dive (nested assets, AIHelper, asset loading)
- **[../rules-abstraction.md](../rules-abstraction.md)** - Rule system architecture
- **[../ai-prompts.md](../ai-prompts.md)** - AI prompt generation pipeline

---

## 📊 Current State vs Target State

### What We Have Now ❌

1. **GameMode Base Class** (`src/gameMode/GameMode.ts`)
   - Abstract class with methods (not Serializable)
   - Methods return hardcoded strings/data
   - No serialization support
   - No asset loading

2. **ClaimGameMode** (`src/gameMode/ClaimGameMode.ts`)
   - Extends GameMode but returns hardcoded strings from methods
   - `getGameRules()` returns new GameRulesContainer with hardcoded strings
   - `getStrategyTips()` returns hardcoded array
   - `getCardRanking()` creates new instance (not data-driven)
   - All logic in methods, not data

3. **GameModeFactory** (`src/gameMode/GameModeFactory.ts`)
   - Creates instances from class constructors (hardcoded registry)
   - Not loading from assets
   - Singleton pattern per ID

4. **Layout System** (`public/GameModeConfig/claim.json`)
   - Only contains UI layout data (table, seats, presets)
   - Missing game rules, AI config, etc.
   - File format: JSON (should be `.asset`)

5. **Serializable System** (`src/lib/serialization/Serializable.ts`)
   - ✅ Exists and ready to use
   - ✅ Supports `@serializable()` decorators
   - ✅ Schema versioning
   - ✅ Migration support
   - ❌ GameMode doesn't use it yet

### What We Need (Unity-like) ✅

1. **GameMode as Serializable Asset**
   - Base class extends/uses Serializable
   - All data as `@serializable()` properties (not methods)
   - Saves as `.asset` files (JSON format)
   - Loads from `.asset` files

2. **ClaimGameMode as Data-Driven Asset**
   - Properties hold data: `@serializable() gameRules: GameRulesContainer`
   - Methods access properties (not hardcoded)
   - All data serializable to `.asset` file

3. **Asset Manager/Loader**
   - Scans `public/GameMode/*.asset` folder (like Unity's Resources folder)
   - Loads and deserializes assets
   - Caches loaded assets

4. **Save System**
   - `GameMode.saveChanges()` → writes to `.asset` file
   - Like Unity's `EditorSaveManager.RequestSave()`
   - Dev-only save via Vite middleware (already exists)

5. **Single `.asset` File Per Game**
   - Contains: rules, AI config, layout paths, all game data
   - Format: JSON (like Unity's `.asset` format)
   - Location: `public/GameMode/claim.asset`

---

## 📋 Unity Reference → Web Implementation Mapping

### Unity Files → Web Components

| Unity Component | Location | Web Implementation | Status |
|----------------|----------|-------------------|--------|
| `SerializedScriptableObject` | Unity base class | `src/lib/serialization/Serializable.ts` | ✅ Exists |
| `GameMode.cs` | `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameMode.cs` | `src/gameMode/GameMode.ts` | ❌ Needs Serializable |
| `ThreeCardGameMode.cs` | `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/ThreeCardGameMode.cs` | `src/gameMode/ClaimGameMode.ts` | ❌ Needs data properties |
| `GameModeManager.cs` | `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameModeManager.cs` | `src/gameMode/GameModeAssetManager.ts` | ❌ Needs to be created |
| `EditorSaveManager.cs` | `References/Scripts/OcentraAI/LLMGames/LLMGamesCommon/EditorSaveManager.cs` | Vite middleware + save API | ✅ Exists (partially) |
| `ISaveScriptable.cs` | `References/Scripts/OcentraAI/LLMGames/Interfaces/ISaveScriptable.cs` | `src/gameMode/interfaces/ISaveGameModeAsset.ts` | ❌ Needs to be created |
| `GameRulesContainer.cs` | `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/GameRulesContainer.cs` | `src/gameMode/GameRulesContainer.ts` | ❌ Needs Serializable |
| `CardRanking.cs` (struct) | `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/CardRanking.cs` | `src/gameMode/CardRanking.ts` | ❌ Needs Serializable |
| `Resources.LoadAll<ScriptableObject>()` | Unity API | `GameModeAssetManager.scanAssets()` | ❌ Needs to be created |
| `.asset` files | `Assets/Resources/GameMode/*.asset` | `public/GameMode/*.asset` | ❌ Needs to be created |

---

## 🔍 What's Missing

### Core Components Missing:

1. **`GameModeAssetManager.ts`** (New File)
   - Scans `public/GameMode/*.asset` folder
   - Loads and deserializes `.asset` files
   - Caches loaded GameMode instances
   - Like Unity's `GameModeManager.OnEnable()` scanning Resources

2. **`ISaveGameModeAsset.ts` Interface** (New File)
   - Like Unity's `ISaveScriptable`
   - Defines `saveChanges()` method

3. **`GameMode.ts` Refactor**
   - Make it Serializable (use `@serializable()` decorators)
   - Convert abstract methods to data properties
   - Add `saveChanges()` method
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameMode.cs`

4. **`ClaimGameMode.ts` Refactor**
   - Convert methods to `@serializable()` properties
   - Data-driven instead of hardcoded
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/ThreeCardGameMode.cs`

5. **`GameRulesContainer.ts` Refactor**
   - Make it Serializable
   - Add `@serializable()` decorators
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/GameRulesContainer.cs`

6. **`CardRanking.ts` Refactor**
   - Make it Serializable (array of CardRanking structs)
   - Reference: `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/CardRanking.cs` (struct with CardName, Value)

7. **Asset File Format**
   - Change `claim.json` → `claim.asset` (or keep JSON but in `.asset` folder)
   - Combine layout + game rules + AI config in one file
   - Location: `public/GameMode/claim.asset`

8. **Save/Load API**
   - Extend Vite middleware to handle `.asset` file saves
   - Create asset loader that deserializes `.asset` files

---

## 📝 Implementation Plan

### Phase 1: Core Serializable Foundation

**Task 1.1: Refactor GameRulesContainer**
- **File:** `src/gameMode/GameRulesContainer.ts`
- **What:** Add `@serializable()` decorators to `LLM` and `Player` properties
- **Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/GameRulesContainer.cs`
- **Action:** Make it a Serializable class with data properties, remove constructor if needed

**Task 1.2: Refactor CardRanking**
- **File:** `src/gameMode/CardRanking.ts`
- **What:** Change from utility class to Serializable data structure (array of CardRanking objects)
- **Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/CardRanking.cs` (struct: CardName, Value)
- **Action:** Create CardRanking interface/class with CardName and Value, make array serializable

**Task 1.3: Create ISaveGameModeAsset Interface**
- **File:** `src/gameMode/interfaces/ISaveGameModeAsset.ts` (new)
- **What:** Define interface with `saveChanges(): Promise<void>` method
- **Reference:** `References/Scripts/OcentraAI/LLMGames/Interfaces/ISaveScriptable.cs`
- **Action:** Simple interface for save contract

### Phase 2: GameMode Base Refactor

**Task 2.1: Make GameMode Serializable**
- **File:** `src/gameMode/GameMode.ts`
- **What:** 
  - Use Serializable pattern (decorate class or extend base)
  - Convert abstract methods to `@serializable()` properties
  - Add `saveChanges()` method
  - Add schema versioning
- **Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameMode.cs` (lines 17-341)
- **Key Properties to Add:**
  - `@serializable() gameRules: GameRulesContainer`
  - `@serializable() gameDescription: GameRulesContainer`
  - `@serializable() strategyTips: GameRulesContainer`
  - `@serializable() cardRankings: CardRanking[]`
  - `@serializable() moveValidityConditions: Record<string, string>`
  - `@serializable() bluffSettings: Record<string, string>`
  - `@serializable() exampleHands: string[]`
  - `@serializable() aiStrategyParameters: {...}`
  - `@serializable() maxRounds: number`
  - `@serializable() turnDuration: number`
  - `@serializable() maxPlayers: number`
  - `@serializable() numberOfCards: number`
  - `@serializable() initialPlayerCoins: number`
  - `@serializable() baseBet: number`
  - `@serializable() layoutAssetPath?: string` (reference to layout JSON)
- **Action:** Replace methods with data properties, keep validation logic in methods that read from properties

**Task 2.2: Add Initialization Pattern**
- **File:** `src/gameMode/GameMode.ts`
- **What:** Add `TryInitialize()` method pattern (like Unity)
- **Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameMode.cs` (lines 145-316)
- **Action:** Create initialization methods that set default values, can be overridden in derived classes

### Phase 3: ClaimGameMode Refactor

**Task 3.1: Convert ClaimGameMode to Data-Driven**
- **File:** `src/gameMode/ClaimGameMode.ts`
- **What:** 
  - Remove hardcoded method returns
  - Set data in properties (like Unity's ThreeCardGameMode)
  - Override initialization methods to populate data
- **Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/ThreeCardGameMode.cs`
- **Key Changes:**
  - `getGameRules()` → property access: `this.gameRules`
  - `getStrategyTips()` → property access: `this.strategyTips`
  - `getCardRanking()` → property access: `this.cardRankings`
  - Override `InitializeGameRules()` to set `gameRules.Player` and `gameRules.LLM`
  - Set all config properties: `maxPlayers = 4`, `numberOfCards = 3`, etc.
- **Action:** Make it data-driven, methods just return property values or validate

**Task 3.2: Add Claim-Specific Properties**
- **File:** `src/gameMode/ClaimGameMode.ts`
- **What:** Add Claim-specific game config as properties
- **Action:** Match Unity pattern - all game-specific values as properties

### Phase 4: Asset Manager & Loading

**Task 4.1: Create GameModeAssetManager**
- **File:** `src/gameMode/GameModeAssetManager.ts` (new)
- **What:** 
  - Singleton manager that scans `public/GameMode/*.asset` folder
  - Loads and deserializes assets
  - Caches loaded GameMode instances
  - Provides `getGameMode(id: string): GameMode` method
  - Provides `getAllGameModes(): GameMode[]` method
- **Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameModeManager.cs`
- **Key Methods:**
  - `scanAssets(): Promise<void>` - Scans folder and loads all `.asset` files
  - `getGameMode(id: string): GameMode | null` - Gets cached instance
  - `loadAsset(path: string): Promise<GameMode>` - Loads and deserializes single asset
  - `getAllGameModes(): GameMode[]` - Returns all loaded modes
- **Action:** Create manager that mirrors Unity's `Resources.LoadAll<GameMode>()` pattern

**Task 4.2: Update GameModeFactory to Use AssetManager**
- **File:** `src/gameMode/GameModeFactory.ts`
- **What:** 
  - Change from class registry to asset loading
  - Use `GameModeAssetManager` to load from assets
  - Fallback to class instantiation if asset not found (for new games)
- **Action:** Refactor to load from assets first, create from class only if asset missing

### Phase 5: Asset File System

**Task 5.1: Create Asset File Structure**
- **File:** `public/GameMode/claim.asset` (new)
- **What:** 
  - Combine game rules + AI config + layout reference in one file
  - JSON format with schema version
  - Structure matches serialized GameMode class
- **Structure:**
  ```json
  {
    "__schemaVersion": 1,
    "gameName": "Claim",
    "maxPlayers": 4,
    "numberOfCards": 3,
    "gameRules": {
      "LLM": "...",
      "Player": "..."
    },
    "cardRankings": [...],
    "layoutAssetPath": "/GameModeConfig/claim.json",
    ...
  }
  ```
- **Action:** Create initial `.asset` file format, migrate from current `claim.json` if needed

**Task 5.2: Extend Save API for .asset Files**
- **File:** `vite.config.ts` (middleware)
- **What:** 
  - Add endpoint for saving `.asset` files: `POST /__dev/api/save-game-mode-asset`
  - Save to `public/GameMode/[gameId].asset`
  - Handle schema versioning
- **Action:** Extend existing save middleware or add new endpoint

**Task 5.3: Asset Loader**
- **File:** `src/gameMode/GameModeAssetLoader.ts` (new, or part of AssetManager)
- **What:** 
  - Fetches `.asset` files from `public/GameMode/`
  - Deserializes using `deserialize(ClaimGameMode, data)`
  - Handles schema migration
- **Action:** Create loader that mirrors Unity's asset loading

### Phase 6: Integration & Migration

**Task 6.1: Update AIManager**
- **File:** `src/ai/AIManager.ts`
- **What:** 
  - Load GameMode from asset instead of creating new instance
  - Use `GameModeAssetManager.getGameMode('claim')`
- **Action:** Change constructor to load from asset

**Task 6.2: Update UI Components**
- **Files:** Any components that use GameMode
- **What:** Ensure they work with asset-loaded GameMode instances
- **Action:** Test and fix any issues

**Task 6.3: Merge Layout & Game Data**
- **Files:** `public/GameModeConfig/claim.json` → `public/GameMode/claim.asset`
- **What:** 
  - Decide: Keep layouts separate OR merge into `.asset` file
  - If merged: `claim.asset` contains both game rules AND layout data
  - If separate: `claim.asset` references layout via `layoutAssetPath`
- **Action:** Choose approach, migrate existing data

**Task 6.4: Update GameModeFactory**
- **File:** `src/gameMode/GameModeFactory.ts`
- **What:** 
  - Change from class registry pattern to asset loading pattern
  - Remove hardcoded class mapping
  - Load from assets first
- **Action:** Refactor to use AssetManager

---

## 🎯 Priority Order

### Phase 1: Foundation (Must Do First)
1. ✅ Make GameRulesContainer Serializable
2. ✅ Make CardRanking Serializable (data structure)
3. ✅ Create ISaveGameModeAsset interface

### Phase 2: Core Refactor (Critical)
4. ✅ Refactor GameMode to use Serializable + data properties
5. ✅ Refactor ClaimGameMode to be data-driven

### Phase 3: Asset System (Required)
6. ✅ Create GameModeAssetManager
7. ✅ Create asset file format and initial `.asset` files
8. ✅ Update GameModeFactory to use AssetManager

### Phase 4: Save/Load (Complete System)
9. ✅ Extend save API for `.asset` files
10. ✅ Test full save/load cycle

### Phase 5: Integration (Polish)
11. ✅ Update all consumers (AIManager, etc.)
12. ✅ Migrate existing data
13. ✅ Test and verify

---

## 📚 Reference Files Summary

### Unity Files to Study:

1. **`References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameMode.cs`**
   - Base class structure
   - All properties with `[OdinSerialize]`
   - Initialization pattern
   - SaveChanges() method

2. **`References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/ThreeCardGameMode.cs`**
   - Concrete implementation pattern
   - How properties are set in initialization
   - Override pattern for InitializeGameRules(), etc.

3. **`References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameModeManager.cs`**
   - Asset scanning pattern
   - `Resources.LoadAll<ScriptableObject>("")` equivalent
   - Caching loaded assets

4. **`References/Scripts/OcentraAI/LLMGames/LLMGamesCommon/EditorSaveManager.cs`**
   - Save queuing pattern
   - `SaveChanges()` implementation
   - Asset persistence

### Our Files to Create/Modify:

1. **`src/gameMode/GameMode.ts`** → Refactor to Serializable
2. **`src/gameMode/ClaimGameMode.ts`** → Refactor to data-driven
3. **`src/gameMode/GameRulesContainer.ts`** → Add Serializable
4. **`src/gameMode/CardRanking.ts`** → Change to data structure
5. **`src/gameMode/GameModeAssetManager.ts`** → NEW (asset scanning/loading)
6. **`src/gameMode/interfaces/ISaveGameModeAsset.ts`** → NEW (save interface)
7. **`src/gameMode/GameModeFactory.ts`** → Refactor to use AssetManager
8. **`public/GameMode/claim.asset`** → NEW (asset file format)
9. **`vite.config.ts`** → Extend save middleware for `.asset` files

---

## 🔑 Key Principles

1. **Data-Driven, Not Hardcoded**
   - All game rules/config as serializable properties
   - Methods read from properties, don't return hardcoded values
   - Unity pattern: properties hold data, methods validate/access

2. **Single Source of Truth**
   - One `.asset` file per game mode
   - Contains ALL game data (rules, AI, layout paths, config)
   - Like Unity's ScriptableObject assets

3. **Asset Loading Like Unity**
   - Scan folder on startup (like `Resources.LoadAll`)
   - Cache loaded instances
   - Lazy load when needed

4. **Schema Versioning**
   - Use Serializable schema versioning
   - Migration support for old data
   - Backward compatibility

5. **Dev-Only Save System**
   - Save via Vite middleware (dev only)
   - Production: assets are pre-built
   - Like Unity's EditorSaveManager (editor-only)

---

## ⚠️ Open Questions / Decisions Needed

1. **File Format:**
   - Keep `.json` extension but in `.asset` folder?
   - OR use `.asset` extension (custom JSON format)?
   - Recommendation: Use `.asset` extension for clarity

2. **Layout Data:**
   - Merge into `.asset` file (single file)?
   - OR keep separate (`claim.asset` + `claim.json`)?
   - Recommendation: Reference via `layoutAssetPath` (modular)

3. **Asset Discovery:**
   - Scan on startup (like Unity)?
   - OR lazy load on demand?
   - Recommendation: Scan on startup, lazy load details

4. **Migration Path:**
   - Convert existing `claim.json` to `claim.asset`?
   - OR create new `.asset` file format?
   - Recommendation: Create new format, migrate layout reference

---

## 📌 Notes for AI Implementation

- **When implementing:** Always reference Unity files to understand data structure
- **Serializable pattern:** Use `@serializable()` decorator on all data properties
- **Methods vs Properties:** Methods should ACCESS properties, not return hardcoded values
- **Initialization:** Use `TryInitialize()` pattern to set default values (can be overridden)
- **Asset Manager:** Should work like Unity's `Resources.LoadAll<GameMode>()` - scans folder, caches instances
- **Save System:** Only in dev mode, uses Vite middleware (already exists)
- **Schema Versioning:** Use Serializable's built-in schema versioning for migrations

---

**Status:** Planning Complete - Ready for Implementation
**Next Step:** Start with Phase 1 (Foundation) - Make supporting classes Serializable

---

## 📖 Additional Resources

### Related Documentation
- **[../README.md](../README.md)** - Main ocentra documentation hub
- **[Unity-Asset-System-Analysis.md](./Unity-Asset-System-Analysis.md)** - Unity system analysis (nested assets, AIHelper, asset loading)
- **[../rules-abstraction.md](../rules-abstraction.md)** - Rule system architecture (BaseBonusRule system)
- **[../ai-prompts.md](../ai-prompts.md)** - AI prompt generation (how AIHelper uses GameMode assets)

### Key Unity Patterns (Study Before Implementing)
1. **Nested Assets:** `GameMode.cs` lines 149-249 - How child BaseBonusRule assets are managed
2. **Asset Initialization:** `GameMode.cs` lines 296-314 - TryInitializeGameMode() pattern
3. **AI Prompt Generation:** `AIHelper.cs` lines 18-32 - GetSystemMessage() using GameMode properties
4. **Asset Discovery:** `GameModeManager.cs` lines 16-40 - Resources.LoadAll() pattern

