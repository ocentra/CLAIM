# AI Event-Driven Pattern

**Purpose:** How AIHelper requests game state information via events (event-driven data sourcing). Shows the pattern of decoupled communication between AI domain and other domains (Engine, UI, Solana).

**Important:** All cross-domain communication is event-driven. UI cannot directly call Engine. Engine cannot directly call Solana. AI cannot directly access game state. They all communicate via events.

---

## Architecture: Event-Driven Domains

**See:** [../Architecture/event-driven-domains.md](../Architecture/event-driven-domains.md) for full architecture details.

### Domain Separation

```
AI Domain ←→ EventBus ←→ Engine Domain (business logic)
AI Domain ←→ EventBus ←→ UI Domain (presentation)
AI Domain ←→ EventBus ←→ Solana Domain (blockchain)
```

**Why?**
- **Decoupling:** Domains don't depend on each other
- **Testability:** Each domain can be tested independently
- **Flexibility:** Can swap implementations without breaking others

---

## Unity Pattern (Reference)

### Request Events Pattern

**Source:** `References/Scripts/OcentraAI/LLMGames/LLMServices/AIHelper.cs` (lines 79-184)

```csharp
private async UniTask<string> GetHandDetails(ulong playerID)
{
    UniTaskCompletionSource<(bool success,string hand)> dataSource = 
        new UniTaskCompletionSource<(bool success, string hand)>();
    
    await EventBus.Instance.PublishAsync<RequestPlayerHandDetailEvent>(
        new RequestPlayerHandDetailEvent(playerID, dataSource));
    
    (bool success, string hand) dataSourceTask = await dataSource.Task;

    if (dataSourceTask.success)
    {
        return $"{dataSourceTask.hand}";
    }
    return "Failed to retrieve Hand details.";
}
```

**Pattern:**
1. Create `UniTaskCompletionSource` (deferred promise)
2. Create request event with completion source
3. Publish event via EventBus
4. Wait for response via completion source
5. Return formatted data

### Request Event Definition

**Source:** `References/Scripts/OcentraAI/LLMGames/Events/GameEvents/RequestPlayerHandDetailEvent.cs`

```csharp
public class RequestPlayerHandDetailEvent : EventArgsBase
{
    public ulong PlayerId;
    public UniTaskCompletionSource<(bool success, string hand)> PlayerHandDetails { get; }

    public RequestPlayerHandDetailEvent(
        ulong playerID, 
        UniTaskCompletionSource<(bool success, string card)> playerHandDetails)
    {
        PlayerHandDetails = playerHandDetails;
        PlayerId = playerID;
    }
}
```

**Pattern:**
- Event carries request parameters (PlayerId)
- Event carries completion source for response
- Handler fills completion source with result

### Event Bus Guarantee

**Important:** Unity's EventBus guarantees delivery to late subscribers by queuing events until handlers register, so UI, gameplay managers, and AI helpers can initialize in any order.

---

## Web Pattern (Current Implementation)

### Request Events Pattern

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
  EventBus.instance.publish(cardsCountEvent)
  EventBus.instance.publish(floorCardsEvent)
  EventBus.instance.publish(allPlayersEvent)

  // Wait for deferred responses
  const [hand, scoreData, remainingCards, floorCards, allPlayers] = 
    await Promise.all([
      handEvent.deferred.promise,
      scoreEvent.deferred.promise,
      cardsCountEvent.deferred.promise,
      floorCardsEvent.deferred.promise,
      allPlayersEvent.deferred.promise,
    ])

  // Format user prompt with current game state
  // ...
}
```

**Pattern:**
1. Create request events (each has deferred promise)
2. Publish all events via EventBus
3. Wait for all responses via `Promise.all()`
4. Format prompt with received data

**Key Difference from Unity:**
- Web uses `Promise.all()` for parallel requests
- Unity uses sequential `await` (can be parallelized)

### Request Event Definition (Web)

**Source:** `src/lib/eventing/events/game.ts` (example)

```typescript
export class RequestPlayerHandDetailEvent extends BaseEvent {
  playerId: string
  deferred: DeferredPromise<Card[]>

  constructor(playerId: string) {
    super()
    this.playerId = playerId
    this.deferred = new DeferredPromise<Card[]>()
  }
}
```

**Pattern:**
- Same pattern as Unity
- Event carries request parameters (playerId)
- Event carries deferred promise for response
- Handler resolves promise with result

---

## Common Request Events

### Unity Request Events

- `RequestPlayerHandDetailEvent` - Get player's hand
- `RequestScoreManagerDetailsEvent` - Get pot, current bet
- `RequestRemainingCardsCountEvent` - Get remaining deck count
- `RequestFloorCardsDetailEvent` - Get floor cards
- `RequestAllPlayersDataEvent` - Get all players data

### Web Request Events

- `RequestPlayerHandDetailEvent` - Get player's hand
- `RequestScoreManagerDetailsEvent` - Get score details
- `RequestRemainingCardsCountEvent` - Get remaining deck count
- `RequestFloorCardsDetailEvent` - Get floor cards
- `RequestAllPlayersDataEvent` - Get all players data

**Same events, different implementations.**

---

## Event Handlers (Other Domains)

### Engine Domain Handles Requests

**Example:** Engine subscribes to `RequestPlayerHandDetailEvent`:

```typescript
// In GameEngine or handler
EventBus.instance.subscribe(RequestPlayerHandDetailEvent, (event) => {
  const playerId = event.playerId
  const hand = this.getPlayerHand(playerId) // Engine logic
  event.deferred.resolve(hand) // Resolve promise
})
```

**Pattern:**
- Handler in Engine domain (owns game state)
- Handler resolves promise with data
- AI domain receives data without direct dependency

---

## Why Event-Driven?

### ❌ Without Events (Tight Coupling)

```typescript
// AI directly depends on Engine
class AIHelper {
  constructor(private gameEngine: GameEngine) {} // Direct dependency
  
  async GetUserPrompt(playerId: string) {
    const hand = await this.gameEngine.getPlayerHand(playerId) // Direct call
    // ...
  }
}
```

**Problems:**
- Tight coupling (AI depends on Engine)
- Hard to test (need full Engine mock)
- Hard to swap implementations
- Circular dependencies possible

### ✅ With Events (Decoupled)

```typescript
// AI has no direct dependencies
class AIHelper {
  async GetUserPrompt(playerId: string) {
    const event = new RequestPlayerHandDetailEvent(playerId)
    EventBus.instance.publish(event)
    const hand = await event.deferred.promise // Event-driven
    // ...
  }
}
```

**Benefits:**
- Decoupled (AI doesn't know about Engine)
- Easy to test (mock events)
- Easy to swap implementations
- No circular dependencies

---

## Related Docs

- [ai-prompt-construction.md](./ai-prompt-construction.md) - How prompts are built (uses event-driven data)
- [../Architecture/event-driven-domains.md](../Architecture/event-driven-domains.md) - Full event-driven architecture
- [../Phases/phase-08-ai-integration.md](../Phases/phase-08-ai-integration.md) - AI Integration phase
- [../Lib/eventbus.md](../Lib/eventbus.md) - EventBus system documentation (use this!)

