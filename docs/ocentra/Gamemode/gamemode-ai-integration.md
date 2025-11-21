# GameMode AI Integration Pattern

**Purpose:** How AIHelper uses GameMode properties to generate AI prompts. Shows which properties are accessed and how they're formatted.

**Reference:** `References/Scripts/OcentraAI/LLMGames/LLMServices/AIHelper.cs` (lines 18-32)

---

## Unity AI Prompt Generation

### GetSystemMessage() Method

```csharp
public string GetSystemMessage(GameMode gameMode)
{
    return "You are an expert AI player in a Three Card Brag game. " +
           "Your goal is to make the best betting decisions based on the strength of your hand, the game rules, and the behavior of the human player. " +
           $"Game Rules: {gameMode.GameRules.LLM}. " +
           $"Card Rankings: {gameMode.CardRankings}. " +
           $"Bonus Rules: {GetBonusRules(gameMode.BonusRules)}. " +
           $"Strategy Tips: {gameMode.StrategyTips}. " +
           $"Bluffing Strategies: {BluffSetting(gameMode.GetBluffSettingConditions())}. " +
           $"Example Hand Descriptions: {GetExampleHandDescriptions(gameMode.GetExampleHandOdds())}. " +
           $"Possible Moves: {GetPossibleMoves(gameMode.GetMoveValidityConditions())}. " +
           $"Difficulty Levels: {GetDifficultyLevel()}";
}
```

**Key Properties Accessed:**
- `gameMode.GameRules.LLM` - Detailed rules for AI
- `gameMode.CardRankings` - Card value rankings
- `gameMode.BonusRules` - List of bonus rules (formatted)
- `gameMode.StrategyTips` - Strategy tips (uses LLM variant)
- `gameMode.GetBluffSettingConditions()` - Dictionary of bluff strategies
- `gameMode.GetExampleHandOdds()` - Dictionary of example hands
- `gameMode.GetMoveValidityConditions()` - Dictionary of move validity

---

## Helper Methods

### GetBonusRules()
Formats bonus rules list into string:
```csharp
private string GetBonusRules(List<BaseBonusRule> rules)
{
    string bonusRules = $"BonusRule {Environment.NewLine}";
    for (int index = 0; index < rules.Count; index++)
    {
        BaseBonusRule bonusRule = rules[index];
        bonusRules += $"bonusRule {index + 1}: {bonusRule.Description} Points {bonusRule.BonusValue} {Environment.NewLine}";
    }
    return bonusRules;
}
```

**Output Format:**
```
BonusRule 
bonusRule 1: Three of a Kind Points 50
bonusRule 2: Pair Points 20
...
```

---

## Web Implementation Mapping

### Phase 2 Task: Ensure Properties Exist

When implementing Phase 2, ensure these properties are Serializable:

1. **GameRulesContainer** - Must have `LLM` property
   - Used by: `gameMode.GameRules.LLM`
   - See: [Phase 01 - Core Serializable Foundation](../Phases/phase-01-core-serializable-foundation.md)

2. **CardRankings[]** - Array of card rankings
   - Used by: `gameMode.CardRankings`
   - Must serialize/deserialize correctly

3. **BonusRules** - List of bonus rules
   - Used by: `gameMode.BonusRules`
   - Each rule has `Description` and `BonusValue`

4. **Dictionaries** - Must be Serializable
   - `MoveValidityConditions: Record<string, string>`
   - `BluffSettingConditions: Record<string, string>`
   - `ExampleHandOdds: Record<string, string>`

### Phase 6 Task: Update AIHelper

When implementing Phase 6, create web AIHelper:

1. **Create `src/ai/AIHelper.ts`**
   - Mirrors Unity's `AIHelper.cs`
   - Uses GameMode properties (not methods)

2. **Implement `getSystemMessage(gameMode: GameMode): string`**
   - Access properties directly: `gameMode.gameRules.LLM`
   - Format dictionaries and arrays same way

3. **Helper methods**
   - `formatBonusRules(rules: BonusRule[]): string`
   - `formatDict(dict: Record<string, string>): string`

---

## Property Access Pattern

**Unity Pattern:**
```csharp
gameMode.GameRules.LLM  // Property access
gameMode.GetMoveValidityConditions()  // Method access
```

**Web Pattern (after Phase 2):**
```typescript
gameMode.gameRules.LLM  // Property access (same as Unity)
gameMode.moveValidityConditions  // Direct property access (no method needed)
```

**Key Difference:** Unity uses some methods (`GetMoveValidityConditions()`), but after Phase 2 refactor, web uses direct property access.

---

## Related Docs

- [ai-prompts.md](../ai-prompts.md) - Overall AI prompt system
- [gamemode-initialization-pattern.md](./gamemode-initialization-pattern.md) - How properties are initialized
- [Phase 02 - GameMode Base Refactor](../Phases/phase-02-gamemode-base-refactor.md) - Property conversion
- [Phase 06 - Integration](../Phases/phase-06-integration-migration.md) - AIHelper integration

