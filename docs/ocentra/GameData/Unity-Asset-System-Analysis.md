# Unity Asset System Deep Analysis

**Purpose:** Complete analysis of Unity's ScriptableObject asset system, especially the nested asset pattern where GameMode contains child BaseBonusRule assets, and how AIHelper uses these assets to drive AI prompts.

**Reference Files:** All Unity scripts in `References/Scripts/OcentraAI/LLMGames/`

---

## 🔍 Key Unity Architecture Patterns

### 1. Nested Asset Pattern (Parent-Child Assets)

**Unity Pattern:** One `.asset` file can contain **multiple ScriptableObjects** - a main parent asset and child assets.

**Example:** `ClaimGameMode.asset` contains:
- Main asset: `ClaimGameMode` (extends `GameMode`)
- Child assets: `ThreeOfAKind`, `PairRule`, `Flush`, `StraightFlush`, etc. (all extend `BaseBonusRule`)

**How Unity Does It:**
```csharp
// In GameMode.TryInitializeBonusRules():
string gameModePath = AssetDatabase.GetAssetPath(this);  // Path to .asset file
Object[] assets = AssetDatabase.LoadAllAssetsAtPath(gameModePath);  // Load ALL assets in that file

// Create new rule as child asset:
BaseBonusRule newRule = Instantiate(templateRule);
AssetDatabase.AddObjectToAsset(newRule, this);  // Add as child to main asset
```

**Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameMode.cs` (lines 162-226)

---

### 2. GameMode Asset Structure

#### Main Properties (All Serializable)
```csharp
[OdinSerialize] public GameRulesContainer GameRules { get; protected set; }
[OdinSerialize] public GameRulesContainer GameDescription { get; protected set; }
[OdinSerialize] public GameRulesContainer StrategyTips { get; protected set; }
[OdinSerialize] public List<BaseBonusRule> BonusRules { get; protected set; }  // Child assets!
[OdinSerialize] public CardRanking[] CardRankings { get; protected set; }
[OdinSerialize] protected Dictionary<PossibleMoves, string> MoveValidityConditions { get; set; }
[OdinSerialize] protected Dictionary<DifficultyLevels, string> BluffSettingConditions { get; set; }
[OdinSerialize] protected Dictionary<HandType, string> ExampleHandOdds { get; set; }
[OdinSerialize] public abstract int MaxPlayers { get; protected set; }
[OdinSerialize] public abstract int MaxRounds { get; protected set; }
// ... more config properties
```

**Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameMode.cs` (lines 105-143)

---

### 3. BaseBonusRule System (Child Assets)

**Purpose:** Rules that evaluate hands and calculate bonus points (e.g., "Three of a Kind", "Flush", "Pair").

**Key Properties:**
```csharp
[OdinSerialize] public abstract int MinNumberOfCard { get; protected set; }
[OdinSerialize] public abstract int BonusValue { get; protected set; }
[OdinSerialize] public abstract int Priority { get; protected set; }
[OdinSerialize] public abstract string RuleName { get; protected set; }
[OdinSerialize] public string Description { get; protected set; }
[OdinSerialize] public GameMode GameMode { get; protected set; }  // Parent reference!
[OdinSerialize] public GameRulesContainer Examples { get; protected set; }  // Examples for this rule
```

**Key Methods:**
- `bool Initialize(GameMode gameMode)` - Initialize rule with parent GameMode
- `bool Evaluate(Hand hand, out BonusDetail bonusDetail)` - Evaluate if hand matches rule
- `string[] CreateExampleHand(...)` - Generate example hands for this rule

**Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/BaseBonusRule.cs`

**Concrete Examples:**
- `ThreeOfAKind.cs` - Evaluates for three cards of same rank
- `PairRule.cs` - Evaluates for pair
- `Flush.cs` - Evaluates for same suit
- `StraightFlush.cs` - Evaluates for sequence + same suit
- See `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/Rules/` folder

---

### 4. Rule Initialization Flow

**Unity Pattern:**
1. GameMode has `BaseBonusRulesTemplate` dictionary (references to template rules)
2. `TryInitializeBonusRules()`:
   - Scans current `.asset` file for existing child rules
   - For each template rule:
     - If child rule exists → update it
     - If not → instantiate template, initialize with GameMode, add as child asset
   - Remove any child rules not in template list
3. All child rules reference parent GameMode via `GameMode` property

**Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameMode.cs` (lines 149-249)

---

### 5. AIHelper System Prompt Generation

**How AIHelper Uses GameMode Assets:**

```csharp
public string GetSystemMessage(GameMode gameMode)
{
    return "You are an expert AI player... " +
           $"Game Rules: {gameMode.GameRules.LLM}. " +  // Rules text
           $"Card Rankings: {gameMode.CardRankings}. " +  // Card values
           $"Bonus Rules: {GetBonusRules(gameMode.BonusRules)}. " +  // List of all rules
           $"Strategy Tips: {gameMode.StrategyTips}. " +  // Tips text
           $"Bluffing Strategies: {BluffSetting(gameMode.GetBluffSettingConditions())}. " +  // Dict
           $"Example Hand Descriptions: {GetExampleHandDescriptions(gameMode.GetExampleHandOdds())}. " +  // Dict
           $"Possible Moves: {GetPossibleMoves(gameMode.GetMoveValidityConditions())}. " +  // Dict
           $"Difficulty Levels: {GetDifficultyLevel()}";
}

private string GetBonusRules(List<BaseBonusRule> rules)
{
    // Converts List<BaseBonusRule> to formatted string:
    // "BonusRule 1: Three of a Kind Points 50
    //  BonusRule 2: Pair Points 20
    //  ..."
    foreach (BaseBonusRule bonusRule in rules)
    {
        bonusRules += $"bonusRule {index + 1}: {bonusRule.Description} Points {bonusRule.BonusValue}\n";
    }
}
```

**Key Point:** AIHelper reads ALL game configuration from GameMode asset and formats it into LLM prompts.

**Reference:** `References/Scripts/OcentraAI/LLMGames/LLMServices/AIHelper.cs` (lines 18-32, 41-52)

---

### 6. Asset File Structure (Unity)

**Unity's `.asset` File Format:**
- YAML-based (human-readable)
- Contains serialized ScriptableObject data
- Can contain multiple objects (parent + children)
- Metadata: GUID, asset type, serialization data

**Example Structure:**
```
%YAML 1.1
%TAG !u! tag:unity3d.com,2011:
--- !u!114 &11400000
MonoBehaviour:
  m_ObjectHideFlags: 0
  m_CorrespondingSourceObject: {fileID: 0}
  m_PrefabInstance: {fileID: 0}
  m_PrefabAsset: {fileID: 0}
  m_GameObject: {fileID: 0}
  m_Enabled: 1
  m_EditorHideFlags: 0
  m_Script: {fileID: 11500000, guid: ..., type: 3}
  m_Name: ClaimGameMode
  GameRules: ...
  BonusRules:  # References to child assets
    - {fileID: 11400001}  # ThreeOfAKind
    - {fileID: 11400002}  # PairRule
  ...
--- !u!114 &11400001  # Child asset: ThreeOfAKind
MonoBehaviour:
  m_ObjectHideFlags: 0
  m_Name: ThreeOfAKind
  GameMode: {fileID: 11400000}  # Parent reference
  BonusValue: 50
  Priority: 1
  ...
```

---

### 7. Asset Loading Pattern (GameModeManager)

**Unity Pattern:**
```csharp
protected override void OnEnable()
{
    // Scan Resources folder for all ScriptableObjects
    allScriptableObjects = Resources.LoadAll<ScriptableObject>("");
    
    // Filter for GameMode instances
    foreach (ScriptableObject obj in allScriptableObjects)
    {
        if (obj is GameMode gameMode)
        {
            if (!AllGameModes.Contains(gameMode))
            {
                AllGameModes.Add(gameMode);
            }
        }
    }
}
```

**Key Points:**
- Scans `Resources/` folder on startup
- Automatically discovers all GameMode assets
- Caches them in `AllGameModes` list

**Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameModeManager.cs` (lines 16-40)

---

## 🎯 Web Implementation Mapping

### What We Need to Build

#### 1. Nested Asset Support
**Challenge:** Web doesn't have Unity's "one file, multiple objects" pattern.

**Solutions:**
- **Option A:** Single JSON file with nested objects
  - `ClaimGameMode.asset` contains main data + `bonusRules: [...]` array (not references)
  - Simpler, but loses "child assets are separate objects" concept
- **Option B:** Separate files + references
  - `ClaimGameMode.asset` contains `bonusRulePaths: ["rules/ThreeOfAKind.asset", ...]`
  - Loads child assets on demand
  - More complex, but matches Unity pattern
- **Option C:** Hybrid (Recommended)
  - Main asset contains embedded rule data (not separate files)
  - Rules are just data in the main asset
  - Simpler for web, still data-driven

**Recommendation:** Option C (hybrid) - embed rule data in main asset JSON.

---

#### 2. Asset File Structure (Web JSON)

**Proposed `.asset` Format (JSON):**
```json
{
  "__schemaVersion": 1,
  "__assetType": "GameMode",
  "__assetId": "claim",
  "metadata": {
    "gameName": "Claim",
    "createdAt": "2025-01-20T...",
    "updatedAt": "2025-01-20T..."
  },
  "gameConfig": {
    "maxPlayers": 4,
    "maxRounds": 10,
    "turnDuration": 60,
    "initialPlayerCoins": 10000,
    "baseBet": 5,
    "numberOfCards": 3,
    "useTrump": false,
    "drawFromDeckAllowed": true
  },
  "rules": {
    "gameRules": {
      "LLM": "... detailed rules for AI ...",
      "Player": "... concise rules for players ..."
    },
    "gameDescription": {
      "LLM": "...",
      "Player": "..."
    },
    "strategyTips": {
      "LLM": "...",
      "Player": "..."
    },
    "bonusRules": [
      {
        "ruleName": "ThreeOfAKind",
        "minNumberOfCard": 3,
        "bonusValue": 50,
        "priority": 1,
        "description": "Three cards of the same rank",
        "examples": {
          "LLM": "...",
          "Player": "..."
        }
      },
      {
        "ruleName": "Pair",
        "minNumberOfCard": 2,
        "bonusValue": 20,
        "priority": 2,
        "description": "Two cards of the same rank",
        "examples": {
          "LLM": "...",
          "Player": "..."
        }
      }
    ],
    "cardRankings": [
      {"cardName": "A", "value": 14},
      {"cardName": "K", "value": 13},
      ...
    ],
    "moveValidityConditions": {
      "pick_up": "Valid when floor card is available",
      "decline": "Always valid",
      ...
    },
    "bluffSettingConditions": {
      "easy": "Rarely bluff",
      "medium": "Occasionally bluff",
      ...
    },
    "exampleHandOdds": {
      "strong": "Three of a Kind, Flush",
      "medium": "Pair",
      "weak": "High Card"
    }
  },
  "uiAssets": {
    "layoutAssetPath": "/GameModeConfig/claim.json",
    "cardImagePath": "/assets/cards/",
    "deckImagePath": "/assets/deck/"
  },
  "aiConfig": {
    "strategyParameters": {
      "aggressiveness": 0.6,
      "riskTolerance": 0.5,
      "bluffFrequency": 0.25
    }
  }
}
```

---

#### 3. Asset Discovery System

**Web Pattern:** Scan `public/GameMode/` folder for `.asset` files

**Implementation:**
```typescript
// GameModeAssetManager.ts
class GameModeAssetManager {
  async scanAssets(): Promise<void> {
    // In browser: Fetch directory listing or asset manifest
    // In dev: Vite can generate manifest of all .asset files
    const manifest = await fetch('/GameMode/manifest.json').then(r => r.json());
    // manifest = { "claim": "claim.asset", "poker": "poker.asset", ... }
    
    for (const [gameId, assetPath] of Object.entries(manifest)) {
      const asset = await this.loadAsset(`${assetPath}`);
      this.cache.set(gameId, asset);
    }
  }
  
  async loadAsset(path: string): Promise<GameModeAsset> {
    const response = await fetch(`/GameMode/${path}`);
    const json = await response.json();
    return deserialize(GameMode, json);  // Deserialize to class instance
  }
}
```

**File Structure:**
```
public/
  GameMode/
    manifest.json  # Auto-generated list of all .asset files
    claim.asset    # Main Claim game mode asset
    poker.asset    # (future)
    ...
  GameModeConfig/  # UI layouts (separate, referenced by .asset)
    claim.json
    ...
```

---

#### 4. GameEditor Dynamic Loading

**Current Problem:** Hardcoded game list in `GameEditorPage.tsx`

**Solution:** Load dynamically from asset manifest

**Implementation:**
```typescript
// GameEditorPage.tsx
const [availableGames, setAvailableGames] = useState<string[]>([]);

useEffect(() => {
  // Fetch asset manifest
  fetch('/GameMode/manifest.json')
    .then(r => r.json())
    .then(manifest => {
      // manifest = { "claim": "claim.asset", ... }
      setAvailableGames(Object.keys(manifest));
    });
}, []);

// Render game selection buttons dynamically
{availableGames.map(gameId => (
  <button onClick={() => navigate(`/GameEditor/${gameId}`)}>
    {gameId}
  </button>
))}
```

---

#### 5. AIHelper Integration

**Web AIHelper Should:**
1. Load GameMode asset
2. Extract all config (rules, bonusRules, etc.)
3. Format into system prompt (same as Unity)
4. Pass to ModelManager

**Implementation:**
```typescript
// src/ai/AIHelper.ts
class AIHelper {
  getSystemMessage(gameMode: GameMode): string {
    return `You are an expert AI player...
      Game Rules: ${gameMode.rules.gameRules.LLM}
      Card Rankings: ${JSON.stringify(gameMode.rules.cardRankings)}
      Bonus Rules: ${this.formatBonusRules(gameMode.rules.bonusRules)}
      Strategy Tips: ${gameMode.rules.strategyTips.LLM}
      Bluffing Strategies: ${this.formatDict(gameMode.rules.bluffSettingConditions)}
      Example Hands: ${this.formatDict(gameMode.rules.exampleHandOdds)}
      Possible Moves: ${this.formatDict(gameMode.rules.moveValidityConditions)}`;
  }
  
  private formatBonusRules(rules: BonusRule[]): string {
    return rules.map((rule, idx) => 
      `BonusRule ${idx + 1}: ${rule.description} Points ${rule.bonusValue}`
    ).join('\n');
  }
}
```

**Reference:** `References/Scripts/OcentraAI/LLMGames/LLMServices/AIHelper.cs`

---

## 📁 Asset File Organization

### Proposed Structure

```
public/
  GameMode/                    # Main game mode assets
    manifest.json              # Auto-generated asset list
    claim.asset                # ClaimGameMode asset (all game data)
    poker.asset                # (future)
    ...
  GameModeConfig/              # UI layout assets (referenced by .asset files)
    claim.json                 # Table layout for Claim
    poker.json                 # (future)
    ...
  assets/                      # Image/sprite assets (referenced by .asset files)
    cards/                     # Card images
      spade_ace.png
      heart_king.png
      ...
    deck/                      # Deck images
      deck_back.png
      ...
```

**Key Points:**
- `.asset` files contain ALL game logic/data (rules, AI config, etc.)
- `.asset` files reference UI layouts via `uiAssets.layoutAssetPath`
- `.asset` files reference images via `uiAssets.cardImagePath`, etc.
- Separation: Game logic (.asset) vs UI config (JSON) vs Images (PNG)

---

## 🔄 Asset Loading Flow

### Unity Flow
1. `GameModeManager.OnEnable()` → Scans `Resources/` folder
2. Finds all `GameMode` assets → Adds to `AllGameModes` list
3. When needed: `GameModeManager.TryGetGameMode(id)` → Returns cached asset
4. Asset contains `BonusRules` list → References child assets (loaded automatically)

### Web Flow (Proposed)
1. **App Startup:** `GameModeAssetManager.scanAssets()` → Fetches `/GameMode/manifest.json`
2. **Load Manifest:** Gets list of all `.asset` files
3. **Lazy Load:** Load `.asset` files on demand (or preload all)
4. **Deserialize:** Convert JSON to `GameMode` class instance
5. **Cache:** Store in `GameModeAssetManager` cache
6. **When Needed:** `GameModeFactory.getGameMode(id)` → Loads from asset if not cached

---

## 🎨 UI Integration (GameEditor)

### Current Flow
1. User visits `/GameEditor` → Hardcoded game list
2. Selects game → Navigates to `/GameEditor/claim`
3. Loads UI layout from `/GameModeConfig/claim.json`

### Proposed Flow
1. User visits `/GameEditor` → Fetches `/GameMode/manifest.json`
2. Renders dynamic game list from manifest
3. User selects game → Navigates to `/GameEditor/claim`
4. Loads GameMode asset: `/GameMode/claim.asset`
5. Extracts `uiAssets.layoutAssetPath` → Loads `/GameModeConfig/claim.json`
6. Renders editor with both game config + UI layout

---

## 🔧 Implementation Checklist

### Phase 1: Asset File Format
- [ ] Define `.asset` JSON schema
- [ ] Create `ClaimGameMode.asset` file with all game data
- [ ] Move rules from hardcoded methods to asset file
- [ ] Embed bonus rules as data (not separate files)

### Phase 2: Asset Manager
- [ ] Create `GameModeAssetManager.ts` (scans, loads, caches)
- [ ] Create `/GameMode/manifest.json` generation (Vite plugin or script)
- [ ] Implement asset loading (fetch + deserialize)
- [ ] Update `GameModeFactory` to use AssetManager

### Phase 3: GameMode Refactor
- [ ] Make `GameMode` Serializable
- [ ] Convert methods to property accessors
- [ ] Update `ClaimGameMode` to read from asset properties

### Phase 4: AIHelper Integration
- [ ] Create web `AIHelper.ts` (mirrors Unity pattern)
- [ ] Format system prompts from GameMode asset
- [ ] Integrate with `AIManager`

### Phase 5: GameEditor Dynamic Loading
- [ ] Update `GameEditorPage` to load from manifest
- [ ] Remove hardcoded game list
- [ ] Load both `.asset` + referenced layout JSON

### Phase 6: Save System
- [ ] Extend Vite middleware for `.asset` file saves
- [ ] Update `TableLayoutEditor` to save via asset system
- [ ] Handle schema versioning in saves

---

## 📚 Reference Files Summary

| Unity File | Purpose | Web Equivalent |
|-----------|---------|---------------|
| `GameMode.cs` | Base class with all properties | `src/gameMode/GameMode.ts` |
| `ThreeCardGameMode.cs` | Concrete implementation | `src/gameMode/ClaimGameMode.ts` |
| `GameModeManager.cs` | Asset scanning/loading | `src/gameMode/GameModeAssetManager.ts` |
| `BaseBonusRule.cs` | Rule base class | Embedded in `.asset` as data (no class needed) |
| `AIHelper.cs` | System prompt generation | `src/ai/AIHelper.ts` |
| `GameRulesContainer.cs` | Rules text container | `src/gameMode/GameRulesContainer.ts` |
| `.asset` files | Unity asset format | `public/GameMode/*.asset` (JSON) |

---

## 🎯 Key Differences: Unity vs Web

| Aspect | Unity | Web |
|--------|-------|-----|
| **Asset Format** | YAML (Unity-specific) | JSON (standard) |
| **Child Assets** | Multiple objects in one file | Nested objects in JSON |
| **Asset Discovery** | `Resources.LoadAll()` | HTTP fetch + manifest |
| **Serialization** | OdinSerialize decorators | `@serializable()` decorators |
| **Save System** | EditorSaveManager (editor-only) | Vite middleware (dev-only) |
| **Runtime Loading** | `Resources.Load()` | HTTP fetch + deserialize |

---

## ✅ Next Steps

1. **Read Main Plan:** [GameMode-Asset-System-Plan.md](./GameMode-Asset-System-Plan.md)
2. **Implement Phase 1:** Create `.asset` file format and first asset
3. **Implement Phase 2:** Build AssetManager and manifest system
4. **Update GameEditor:** Make it load dynamically from manifest
5. **Integrate AIHelper:** Use asset data for AI prompts

---

**Status:** Analysis Complete - Ready for Implementation
**Linked From:** [../README.md](../README.md) (main hub)

