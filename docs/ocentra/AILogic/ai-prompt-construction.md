# AI Prompt Construction Pattern

**Purpose:** How AI prompts are built from GameMode properties and live game state. Shows the pattern of constructing system prompts (static from GameMode) and user prompts (dynamic from game state).

**Important:** This pattern is **universal** - it works the same regardless of game type (card game or not), AI system (Unity vs Web), or LLM provider.

---

## Unity Pattern (Reference)

### System Prompt Construction

**Source:** `References/Scripts/OcentraAI/LLMGames/LLMServices/AIHelper.cs` (lines 18-32)

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

**Key Properties Used:**
- `gameMode.GameRules.LLM` - Detailed rules for AI (not Player variant)
- `gameMode.CardRankings` - Card value rankings
- `gameMode.BonusRules` - List of bonus rules (formatted)
- `gameMode.StrategyTips` - Strategy tips
- `gameMode.GetBluffSettingConditions()` - Bluff strategies
- `gameMode.GetExampleHandOdds()` - Example hands
- `gameMode.GetMoveValidityConditions()` - Move validity

**Pattern:**
- System prompt = Static content from GameMode
- Uses `.LLM` variant (detailed, AI-focused) not `.Player` variant (concise, UI-friendly)
- Stitched together as a single string

---

### User Prompt Construction

**Source:** `References/Scripts/OcentraAI/LLMGames/LLMServices/AIHelper.cs` (lines 34-62)

```csharp
public string GetUserPrompt(ulong playerID)
{
    return $"Current Hand: {GetHandDetails(playerID)}. " +
           $"Current Game State: {GetGameStateDetails()}. " +
           $"Move Options: {GetMoveWord()}";
}

private async UniTask<string> GetGameStateDetails()
{
    string scoreManagerDetails = await GetScoreManagerDetails();
    string deckDetails = await GetDeckDetails();
    string floorDetails = await GetFloorDetails();
    string playerDetails = await GetPlayerDetails();

    return $"ScoreManagerDetails: {scoreManagerDetails}{Environment.NewLine}" +
           $"Deck: {deckDetails}{Environment.NewLine}" +
           $"FloorCard: {floorDetails}{Environment.NewLine}" +
           $"Players: {playerDetails}";
}
```

**Pattern:**
- User prompt = Dynamic content from live game state
- Queries game state via events (see [ai-event-driven-pattern.md](./ai-event-driven-pattern.md))
- Formatted as a descriptive string

---

## Web Pattern (Current Implementation)

### System Prompt Construction

**Source:** `src/ai/AIHelper.ts` (lines 45-80)

```typescript
GetSystemMessage(gameMode: GameMode): string {
  const rules = gameMode.getGameRules()
  const description = gameMode.getGameDescription()
  const strategyTips = gameMode.getStrategyTips()
  const bonusRules = gameMode.getBonusRules()
  const moveValidity = gameMode.getMoveValidityConditions()
  const bluffSettings = gameMode.getBluffSettings()
  const examples = gameMode.getExampleHands()

  let systemMessage = `You are an AI assistant playing ${description}\n\n`
  systemMessage += `GAME RULES:\n${rules.LLM}\n\n`
  systemMessage += `BONUS RULES:\n${bonusRules}\n\n`
  systemMessage += `MOVE VALIDITY:\n${moveValidity}\n\n`
  systemMessage += `BLUFF SETTINGS:\n${bluffSettings}\n\n`
  
  // ... formatted sections ...
  
  return systemMessage
}
```

**Key Properties Used:**
- Same properties as Unity pattern
- Uses `.LLM` variant (detailed, AI-focused)
- Formatted as structured sections with headers

**Pattern:**
- Same pattern as Unity
- System prompt = Static content from GameMode
- Stitched together as structured sections

---

### User Prompt Construction

**Source:** `src/ai/AIHelper.ts` (lines 87-162)

```typescript
async GetUserPrompt(playerId: string): Promise<string> {
  // Request game state via events
  const handEvent = new RequestPlayerHandDetailEvent(playerId)
  const scoreEvent = new RequestScoreManagerDetailsEvent()
  const cardsCountEvent = new RequestRemainingCardsCountEvent()
  const floorCardsEvent = new RequestFloorCardsDetailEvent()
  const allPlayersEvent = new RequestAllPlayersDataEvent()

  // Publish events and wait for responses
  EventBus.instance.publish(handEvent)
  EventBus.instance.publish(scoreEvent)
  // ... publish all events ...

  // Wait for deferred responses
  const [hand, scoreData, remainingCards, floorCards, allPlayers] = await Promise.all([
    handEvent.deferred.promise,
    scoreEvent.deferred.promise,
    // ... wait for all ...
  ])

  // Format user prompt with current game state
  let userPrompt = `CURRENT GAME STATE:\n\n`
  // ... formatted sections ...
  
  return userPrompt
}
```

**Pattern:**
- Same pattern as Unity
- User prompt = Dynamic content from live game state
- Queries game state via events (see [ai-event-driven-pattern.md](./ai-event-driven-pattern.md))
- Formatted as structured sections

---

## Key Differences: Unity vs Web

### What Stays the Same

✅ **Prompt Structure**
- System prompt = Static from GameMode
- User prompt = Dynamic from game state
- Both stitched together before sending to LLM

✅ **GameMode Properties**
- Same properties accessed (GameRules.LLM, CardRankings, BonusRules, etc.)
- Uses `.LLM` variant (detailed, AI-focused)

✅ **Event-Driven Pattern**
- Game state queried via events (decoupled from domains)

### What Differs

❌ **AI System**
- **Unity:** Uses Unity's AIModelManager, BaseLLMService, UnityWebRequest
- **Web:** Uses different provider abstraction (see `src/ai/`)

❌ **Provider Details**
- **Unity:** Unity-specific provider abstraction (Resources.LoadAll, ScriptableObject providers)
- **Web:** Different provider abstraction (see [ai-provider-abstraction.md](./ai-provider-abstraction.md))

❌ **Response Format**
- **Unity:** Direct string response from LLM
- **Web:** JSON-structured response (parsed into decision payload)

---

## Universal Pattern (Game Type Agnostic)

**Important:** This pattern works for **any game type** (card game or not):

### System Prompt Pattern
```
System Prompt = 
  "You are an AI assistant playing [GameMode.Description]." +
  "GAME RULES: [GameMode.GameRules.LLM]" +
  "[Other GameMode properties formatted]"
```

### User Prompt Pattern
```
User Prompt = 
  "CURRENT GAME STATE:" +
  "YOUR HAND: [queried via event]" +
  "[Other game state queried via events]"
```

**Pattern is the same regardless of:**
- Card game vs non-card game
- Specific game rules
- AI system (Unity vs Web)

**Only difference:** Which GameMode properties are accessed (depends on game type).

---

## Related Docs

- [ai-event-driven-pattern.md](./ai-event-driven-pattern.md) - How game state is queried via events
- [ai-provider-abstraction.md](./ai-provider-abstraction.md) - How LLM providers are abstracted
- [../Gamemode/gamemode-ai-integration.md](../Gamemode/gamemode-ai-integration.md) - Which GameMode properties AIHelper needs
- [../Phases/phase-08-ai-integration.md](../Phases/phase-08-ai-integration.md) - AI Integration phase

