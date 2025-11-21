# GameMode UI Usage Pattern

**Purpose:** How UI screens use GameMode properties to display game information. Shows which properties are accessed and how they're displayed.

**References:**
- `References/Scripts/OcentraAI/LLMGames/UI/GameScreens/RulesScreen.cs` (line 44)
- `References/Scripts/OcentraAI/LLMGames/UI/GameScreens/WelcomeScreen.cs` (lines 69-71)

---

## Unity UI Usage

### RulesScreen

```csharp
[Required] public GameMode GameMode;

protected override void Awake()
{
    base.Awake();
    RulesText.text = GameMode.GameRules.Player;  // Uses Player variant
    BackButton.onClick.AddListener(GoBack);
}
```

**Key Property:**
- `GameMode.GameRules.Player` - Concise rules for players (not LLM variant)

---

### WelcomeScreen

```csharp
[Required] public GameMode GameMode;

private void UpdateText()
{
    RulesText.text = GameMode.GameRules.Player;
    DescriptionText.text = GameMode.GameDescription.Player;
    TipsText.text = GameMode.StrategyTips.Player;
}
```

**Key Properties:**
- `GameMode.GameRules.Player` - Rules text (Player variant)
- `GameMode.GameDescription.Player` - Description text (Player variant)
- `GameMode.StrategyTips.Player` - Tips text (Player variant)

**Pattern:**
- UI always uses `.Player` variant (concise, user-friendly)
- Never uses `.LLM` variant (detailed, AI-focused)

---

## Web Implementation Mapping

### Phase 2 Task: Ensure Properties Exist

When implementing Phase 2, ensure GameRulesContainer has both variants:

1. **GameRulesContainer must have:**
   - `LLM: string` - Detailed rules for AI prompts
   - `Player: string` - Concise rules for UI display

2. **Properties needed for UI:**
   - `gameMode.gameRules.Player` - For rules display
   - `gameMode.gameDescription.Player` - For description display
   - `gameMode.strategyTips.Player` - For tips display

### UI Component Pattern

**Unity Pattern:**
```csharp
RulesText.text = GameMode.GameRules.Player;  // Direct property access
```

**Web Pattern (after Phase 2):**
```typescript
rulesText.text = gameMode.gameRules.Player;  // Same pattern
```

---

## Player vs LLM Variants

**Why Two Variants?**

- **Player variant:** Concise, human-readable, UI-friendly
  - Example: "Each player is dealt 3 cards. Bet blind or see hand."

- **LLM variant:** Detailed, structured, AI-friendly
  - Example: "Three Card Brag: 3 cards dealt each round. Bet blind or see hand. Blind bet doubles, seen hand bet doubles current bet..."

**Usage:**
- UI → Always use `.Player`
- AI → Always use `.LLM`

---

## Related Docs

- [game-modes.md](./game-modes.md) - Overall GameMode architecture
- [gamemode-ai-integration.md](./gamemode-ai-integration.md) - How AI uses LLM variants
- [Phase 02 - GameMode Base Refactor](../Phases/phase-02-gamemode-base-refactor.md) - Property conversion

