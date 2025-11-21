# GameMode Documentation Hub

**Purpose:** Atomic documentation chunks for understanding and implementing GameMode system. Each doc focuses on one aspect of how GameMode works in Unity and how to replicate it in web.

**Strategy:** DRY - Each doc is focused and self-contained. Navigate based on what you're implementing.

---

## 📚 Quick Navigation

### Understanding GameMode Concepts
- **[game-modes.md](./game-modes.md)** - Overall GameMode architecture and concepts

### Implementation Patterns (Unity → Web)

#### Initialization & Setup
- **[gamemode-initialization-pattern.md](./gamemode-initialization-pattern.md)**
  - How GameMode initializes itself
  - TryInitialize() flow
  - InitializeGameRules(), InitializeCardRankings(), etc.
  - **Read when:** Implementing Phase 2 (GameMode base refactor) Step 3

#### AI Integration
- **[gamemode-ai-integration.md](./gamemode-ai-integration.md)**
  - How AIHelper uses GameMode properties
  - Which properties are accessed for prompts
  - GetSystemMessage() pattern
  - **Read when:** Implementing Phase 2 Step 2 (property conversion) or Phase 6 (AIHelper integration)

#### Game Configuration Usage
- **[gamemode-network-usage.md](./gamemode-network-usage.md)**
  - Which GameMode properties are used for game configuration
  - TurnDuration, MaxRounds defaults
  - **Note:** Unity uses its own multiplayer system. Our web uses Solana for multiplayer/single player.
  - **Read when:** Implementing Phase 2 Step 2 (property conversion)

#### UI Usage
- **[gamemode-ui-usage.md](./gamemode-ui-usage.md)**
  - How UI screens use GameMode properties
  - RulesScreen, WelcomeScreen patterns
  - Player vs LLM variants
  - **Read when:** Implementing Phase 2 Step 2 (property conversion) or Phase 6 (UI updates)

#### Editor Usage
- **[gamemode-editor-usage.md](./gamemode-editor-usage.md)**
  - How GameModeEditor works
  - Rule template loading
  - Rule selection UI
  - **Read when:** Implementing Phase 5 (asset file system) or web editor

#### Discovery & Loading
- **[gamemode-discovery-pattern.md](./gamemode-discovery-pattern.md)**
  - How GameModeManager discovers assets
  - Resources.LoadAll() pattern
  - Manifest-based discovery (web)
  - **Read when:** Implementing Phase 4 (asset manager & loading)

---

## 🎯 When Working on Specific Phases

### Phase 1: Core Serializable Foundation
→ No GameMode-specific docs needed yet (focuses on supporting classes)

### Phase 2: GameMode Base Refactor
**Must Read:**
- [gamemode-initialization-pattern.md](./gamemode-initialization-pattern.md) - **Step 3** (TryInitialize pattern)
- [gamemode-ai-integration.md](./gamemode-ai-integration.md) - **Step 2** (which properties AIHelper needs)
- [gamemode-ui-usage.md](./gamemode-ui-usage.md) - **Step 2** (which properties UI needs)
- [gamemode-network-usage.md](./gamemode-network-usage.md) - **Step 2** (which properties are needed for game config - TurnDuration, MaxRounds)

### Phase 3: ClaimGameMode Refactor
**Must Read:**
- [gamemode-initialization-pattern.md](./gamemode-initialization-pattern.md) - How to override initialization methods

### Phase 4: Asset Manager & Loading
**Must Read:**
- [gamemode-discovery-pattern.md](./gamemode-discovery-pattern.md) - **Steps 1-3** (discovery and loading pattern)

### Phase 5: Asset File System
**Must Read:**
- [gamemode-editor-usage.md](./gamemode-editor-usage.md) - Editor pattern for reference

### Phase 6: Integration & Migration
**Must Read:**
- [gamemode-ai-integration.md](./gamemode-ai-integration.md) - **Step 1 & 6** (AIHelper integration)
- [gamemode-ui-usage.md](./gamemode-ui-usage.md) - **Step 3** (UI component updates)
- [gamemode-network-usage.md](./gamemode-network-usage.md) - If using GameMode for game config defaults
- [gamemode-editor-usage.md](./gamemode-editor-usage.md) - **Step 4** (GameEditor integration)

---

## 🏗️ How to Create a New GameMode

### Unity Pattern (Reference)
1. **Create GameMode Asset**
   - Create new ScriptableObject asset extending GameMode
   - Example: `ThreeCardGameMode.asset`

2. **Override Initialization Methods**
   - Override `InitializeGameRules()` - Set rule text
   - Override `InitializeCardRankings()` - Set card values
   - Override other initialization methods as needed

3. **Set Game Config Properties**
   - Set `MaxPlayers`, `NumberOfCards`, `MaxRounds`, etc.
   - Set game-specific config

4. **Select Bonus Rules**
   - Use GameModeEditor to select which rules apply
   - Rules are created as child assets

5. **Call TryInitialize()**
   - In editor: Click "TryInitialize" button
   - Initializes all data and saves

### Web Pattern (After Asset System Complete)
1. **Create GameMode Class**
   - File: `src/gameMode/[GameName]GameMode.ts`
   - Extends `GameMode`
   - Override initialization methods

2. **Create Asset File**
   - File: `public/GameMode/[gamename].asset`
   - Contains all game data (rules, config, etc.)
   - Can be created manually or via editor

3. **Add to Manifest**
   - File: `public/GameMode/manifest.json`
   - Add entry: `"gamename": "gamename.asset"`

4. **Test Loading**
   - Use GameModeAssetManager to load asset
   - Verify all properties load correctly

---

## 📖 Documentation Structure

```
docs/ocentra/Gamemode/
├── README.md                         # ← You are here (hub)
├── game-modes.md                     # Overall architecture
├── gamemode-initialization-pattern.md    # Initialization flow
├── gamemode-ai-integration.md            # AI usage
├── gamemode-network-usage.md             # Game configuration usage
├── gamemode-ui-usage.md                  # UI usage
├── gamemode-editor-usage.md              # Editor pattern
└── gamemode-discovery-pattern.md         # Asset discovery
```

---

## 🔗 Related Documentation

### Main Hub
- [../README.md](../README.md) - Main ocentra documentation hub

### Planning & Analysis
- [../GameData/GameMode-Asset-System-Plan.md](../GameData/GameMode-Asset-System-Plan.md) - Implementation plan
- [../GameData/Unity-Asset-System-Analysis.md](../GameData/Unity-Asset-System-Analysis.md) - Unity deep dive

### Phases
- [../Phases/phase-01-core-serializable-foundation.md](../Phases/phase-01-core-serializable-foundation.md) - Foundation
- [../Phases/phase-02-gamemode-base-refactor.md](../Phases/phase-02-gamemode-base-refactor.md) - Base refactor
- [../Phases/phase-03-claimgamemode-refactor.md](../Phases/phase-03-claimgamemode-refactor.md) - Claim refactor
- [../Phases/phase-04-asset-manager-loading.md](../Phases/phase-04-asset-manager-loading.md) - Asset manager
- [../Phases/phase-05-asset-file-system.md](../Phases/phase-05-asset-file-system.md) - Asset files
- [../Phases/phase-06-integration-migration.md](../Phases/phase-06-integration-migration.md) - Integration

### Other Systems
- [../ai-prompts.md](../ai-prompts.md) - AI prompt system
- [../rules-abstraction.md](../rules-abstraction.md) - Rule system
- [../game-editor-system.md](../game-editor-system.md) - Editor tool

---

**Last Updated:** 2025-01-20  
**Structure Pattern:** Atomic docs (one topic per file) with hub navigation

