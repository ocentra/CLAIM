# Event-Driven Domain Architecture

**Purpose:** Explains the event-driven architecture pattern used throughout Ocentra Games. All cross-domain communication happens via events, not direct calls.

**Key Principle:** **Anything that is cross-domain is event-driven.** UI is a domain. Engine (business logic) is a domain. Solana (blockchain) is a domain. They communicate via events, not direct interactions.

---

## Domain Separation

### Core Domains

1. **UI Domain** (`src/ui/`)
   - **Purpose:** Presentation layer
   - **Responsibility:** Render game state, handle user input
   - **Cannot:** Directly call Engine, Solana, or AI

2. **Engine Domain** (`src/engine/`)
   - **Purpose:** Business logic layer
   - **Responsibility:** Game rules, state management, calculations
   - **Cannot:** Directly call UI, Solana, or AI

3. **Solana Domain** (`src/services/solana/`)
   - **Purpose:** Blockchain layer
   - **Responsibility:** On-chain transactions, state verification
   - **Cannot:** Directly call UI, Engine, or AI

4. **AI Domain** (`src/ai/`)
   - **Purpose:** AI decision making
   - **Responsibility:** Generate AI moves, prompt construction
   - **Cannot:** Directly call UI, Engine, or Solana

---

## Event-Driven Communication

### Architecture Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   UI        │◄───────►│  EventBus   │◄───────►│   Engine    │
│  Domain     │  Events │             │  Events │   Domain    │
└─────────────┘         └─────────────┘         └─────────────┘
                              ▲                        ▲
                              │                        │
                              │ Events                 │ Events
                              │                        │
                       ┌──────┴──────┐         ┌──────┴──────┐
                       │   Solana    │         │     AI      │
                       │   Domain    │         │   Domain    │
                       └─────────────┘         └─────────────┘
```

**All cross-domain communication goes through EventBus.**

---

## Why Event-Driven?

### ❌ Without Events (Tight Coupling)

```typescript
// UI directly depends on Engine
class GameScreen {
  constructor(private gameEngine: GameEngine) {} // Direct dependency
  
  handlePlayerAction(action: PlayerAction) {
    this.gameEngine.processAction(action) // Direct call
    const state = this.gameEngine.getState() // Direct call
    this.updateUI(state) // UI logic
  }
}
```

**Problems:**
- **Tight coupling:** UI depends on Engine
- **Hard to test:** Need full Engine mock
- **Hard to swap:** Can't easily swap Engine implementation
- **Circular dependencies:** Possible between domains
- **Violates separation:** UI knows about Engine internals

### ✅ With Events (Decoupled)

```typescript
// UI has no direct dependencies
class GameScreen {
  handlePlayerAction(action: PlayerAction) {
    const event = new PlayerActionEvent(action)
    EventBus.instance.publish(event) // Event-driven
  }
  
  useEffect(() => {
    // Subscribe to state updates
    EventBus.instance.subscribe(UpdateGameStateEvent, (event) => {
      this.updateUI(event.state) // React to state changes
    })
  })
}
```

**Benefits:**
- **Decoupled:** UI doesn't know about Engine
- **Easy to test:** Mock events, no dependencies
- **Easy to swap:** Swap Engine without changing UI
- **No circular dependencies:** Events flow one way
- **Separation maintained:** UI only knows about events

---

## Event Flow Examples

### Example 1: UI → Engine (Player Action)

```
1. User clicks "Pick Up Card" button (UI)
2. UI publishes: PlayerActionEvent { type: 'pick_up', playerId: 'p1' }
3. Engine subscribes to: PlayerActionEvent
4. Engine processes action (business logic)
5. Engine publishes: UpdateGameStateEvent { state: newState }
6. UI subscribes to: UpdateGameStateEvent
7. UI updates display (presentation)
```

**Flow:** UI → EventBus → Engine → EventBus → UI

### Example 2: Engine → Solana (Submit Move)

```
1. Engine processes action (valid move)
2. Engine publishes: SubmitMoveToSolanaEvent { matchId, action }
3. Solana service subscribes to: SubmitMoveToSolanaEvent
4. Solana submits transaction (blockchain)
5. Solana publishes: SolanaTransactionResultEvent { success, txId }
6. Engine subscribes to: SolanaTransactionResultEvent
7. Engine updates state (business logic)
```

**Flow:** Engine → EventBus → Solana → EventBus → Engine

### Example 3: AI → Engine (Request Game State)

```
1. AI needs game state for prompt
2. AI publishes: RequestPlayerHandDetailEvent { playerId, deferred }
3. Engine subscribes to: RequestPlayerHandDetailEvent
4. Engine resolves deferred: hand = getPlayerHand(playerId)
5. AI receives hand via deferred promise
6. AI builds prompt and generates move
```

**Flow:** AI → EventBus → Engine → AI (via deferred promise)

---

## Event Types

### Action Events (Commands)
- `PlayerActionEvent` - UI publishes, Engine handles
- `SubmitMoveToSolanaEvent` - Engine publishes, Solana handles
- `StartGameEvent` - UI publishes, Engine handles

### State Events (Updates)
- `UpdateGameStateEvent` - Engine publishes, UI subscribes
- `SolanaTransactionResultEvent` - Solana publishes, Engine subscribes
- `AIDecisionEvent` - AI publishes, Engine subscribes

### Request Events (Queries)
- `RequestPlayerHandDetailEvent` - AI publishes, Engine handles (with deferred promise)
- `RequestScoreManagerDetailsEvent` - AI publishes, Engine handles
- `RequestAllPlayersDataEvent` - AI publishes, Engine handles

---

## EventBus Implementation

**Location:** `src/lib/eventing/EventBus.ts`

**Key Features:**
- Publish/subscribe pattern
- Type-safe events
- Deferred promises for request/response
- Late subscriber support (queue events until handlers register)

**Usage:**
```typescript
// Publish event
EventBus.instance.publish(new PlayerActionEvent(action))

// Subscribe to event
EventBus.instance.subscribe(UpdateGameStateEvent, (event) => {
  // Handle event
})

// Request/response pattern
const event = new RequestPlayerHandDetailEvent(playerId)
EventBus.instance.publish(event)
const hand = await event.deferred.promise
```

---

## Domain Rules

### UI Domain Rules

✅ **Can:**
- Publish action events (`PlayerActionEvent`)
- Subscribe to state events (`UpdateGameStateEvent`)
- Subscribe to UI events (`ShowScreenEvent`)

❌ **Cannot:**
- Directly call Engine methods
- Directly call Solana methods
- Directly call AI methods

### Engine Domain Rules

✅ **Can:**
- Subscribe to action events (`PlayerActionEvent`)
- Publish state events (`UpdateGameStateEvent`)
- Handle request events (`RequestPlayerHandDetailEvent`)
- Publish Solana events (`SubmitMoveToSolanaEvent`)

❌ **Cannot:**
- Directly call UI methods
- Directly call Solana methods (must use events)
- Directly call AI methods

### Solana Domain Rules

✅ **Can:**
- Subscribe to Solana events (`SubmitMoveToSolanaEvent`)
- Publish result events (`SolanaTransactionResultEvent`)

❌ **Cannot:**
- Directly call UI methods
- Directly call Engine methods
- Directly call AI methods

### AI Domain Rules

✅ **Can:**
- Publish request events (`RequestPlayerHandDetailEvent`)
- Publish decision events (`AIDecisionEvent`)

❌ **Cannot:**
- Directly call UI methods
- Directly call Engine methods (must use request events)
- Directly call Solana methods

---

## Benefits

1. **Separation of Concerns**
   - Each domain has clear responsibilities
   - Domains don't know about each other

2. **Testability**
   - Each domain can be tested independently
   - Mock events instead of mocking entire domains

3. **Flexibility**
   - Swap implementations without breaking others
   - Add new domains without changing existing code

4. **Maintainability**
   - Clear boundaries between domains
   - Easy to understand data flow

5. **Scalability**
   - Add new features by adding events
   - No circular dependencies

---

## Related Docs

- [../AILogic/ai-event-driven-pattern.md](../AILogic/ai-event-driven-pattern.md) - How AI uses events for game state
- [../AILogic/README.md](../AILogic/README.md) - AI Logic documentation hub
- [../Lib/eventbus.md](../Lib/eventbus.md) - EventBus system documentation (use this!)
- `src/lib/eventing/EventBus.ts` - EventBus implementation
- `src/lib/eventing/README.md` - Full EventBus documentation with examples

---

**Last Updated:** 2025-01-20  
**Key Principle:** All cross-domain communication is event-driven

