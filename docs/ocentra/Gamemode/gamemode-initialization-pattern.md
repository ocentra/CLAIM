# GameMode Initialization Pattern

**Purpose:** How GameMode initializes itself and its child assets (BaseBonusRule) in Unity. This pattern must be replicated in the web implementation.

**Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameMode.cs` (lines 29-316)

---

## Unity Initialization Flow

### Main Initialization Method

```csharp
protected bool TryInitializeGameMode()
{
    if (!TryInitializeBonusRules())
    {
        return false;
    }

    InitializeGameRules();
    InitializeGameDescription();
    InitializeStrategyTips();
    InitializeCardRankings();
    InitializeMoveValidityConditions();
    InitializeBluffSettingConditions();
    InitializeExampleHandOdds();
    SaveChanges();

    return true;
}
```

**Key Points:**
- Calls `TryInitializeBonusRules()` first (handles child assets)
- Then calls individual initialization methods
- Calls `SaveChanges()` at the end
- Returns `true` if successful

---

## Initialization Methods

Each initialization method is `protected virtual` and can be overridden in derived classes:

### InitializeGameRules()
- Sets `GameRules.Player` and `GameRules.LLM` properties
- Contains game-specific rule text
- Separate text for Player (concise) and LLM (detailed)

### InitializeGameDescription()
- Sets `GameDescription.Player` and `GameDescription.LLM`
- Contains game description/overview

### InitializeStrategyTips()
- Sets `StrategyTips.Player` and `StrategyTips.LLM`
- Contains strategy advice for players/AI

### InitializeCardRankings()
- Populates `CardRankings[]` array
- Defines card values for this game mode

### InitializeMoveValidityConditions()
- Populates `MoveValidityConditions` dictionary
- Maps move types to validity descriptions

### InitializeBluffSettingConditions()
- Populates `BluffSettingConditions` dictionary
- Maps difficulty levels to bluffing strategies

### InitializeExampleHandOdds()
- Populates `ExampleHandOdds` dictionary
- Maps hand types to example descriptions

---

## TryInitializeBonusRules() Pattern

**Purpose:** Manages child BaseBonusRule assets within the GameMode asset.

**Flow:**
1. Scans current `.asset` file for existing child rules
2. For each template rule in `BaseBonusRulesTemplate`:
   - If child rule exists → update it
   - If not → instantiate template, initialize with GameMode, add as child asset
3. Remove any child rules not in template list

**Reference:** `References/Scripts/OcentraAI/LLMGames/GameMode/CardGames/GameMode.cs` (lines 149-249)

---

## Web Implementation Mapping

### Phase 2 Task: Add Initialization Pattern

When implementing Phase 2, you need to:

1. **Add `TryInitialize(): boolean` method**
   - File: `src/gameMode/GameMode.ts`
   - Calls all initialization methods
   - Calls `saveChanges()` at end
   - Returns `true` if successful

2. **Add initialization methods**
   - `InitializeGameRules()` - Sets gameRules property
   - `InitializeGameDescription()` - Sets gameDescription property
   - `InitializeStrategyTips()` - Sets strategyTips property
   - `InitializeCardRankings()` - Populates cardRankings array
   - `InitializeMoveValidityConditions()` - Populates dictionary
   - `InitializeBluffSettingConditions()` - Populates dictionary
   - `InitializeExampleHandOdds()` - Populates dictionary

3. **Make methods `protected` and `virtual`**
   - Derived classes (ClaimGameMode) can override them
   - Base methods set default/empty values

---

## Related Docs

- [game-modes.md](./game-modes.md) - Overall GameMode architecture
- [gamemode-ai-integration.md](./gamemode-ai-integration.md) - How AI uses initialized data
- [Phase 02 - GameMode Base Refactor](../Phases/phase-02-gamemode-base-refactor.md) - Implementation phase

