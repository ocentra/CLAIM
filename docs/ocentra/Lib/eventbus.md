# EventBus Library

**Purpose:** Event-driven communication system for cross-domain messaging. All cross-domain communication in Ocentra Games uses EventBus.

**Location:** `src/lib/eventing/EventBus.ts`

**Full Documentation:** `src/lib/eventing/README.md` (detailed usage guide)

---

## What It Does

EventBus provides a publish/subscribe pattern for decoupled communication between domains:
- **UI Domain** ↔ **Engine Domain**
- **Engine Domain** ↔ **Solana Domain**
- **AI Domain** ↔ **Engine Domain**
- Any other cross-domain communication

**Key Principle:** All cross-domain communication is event-driven. Domains don't call each other directly.

---

## Quick Start

### Publishing Events

```typescript
import { EventBus } from '@lib/eventing'
import { PlayerActionEvent } from './events'

// Publish synchronous event
const result = EventBus.instance.publish(
  new PlayerActionEvent({ type: 'pick_up', playerId: 'p1' })
)

// Publish async event (waits for async handlers)
const result = await EventBus.instance.publishAsync(
  new PlayerActionEvent({ type: 'pick_up', playerId: 'p1' }),
  { timeoutMs: 5000 }
)
```

### Subscribing to Events

```typescript
import { EventRegistrar, createEventRegistrar } from '@lib/eventing'
import { UpdateGameStateEvent } from './events'

// Create registrar (auto-cleanup on dispose)
const registrar = createEventRegistrar()

registrar.subscribe(UpdateGameStateEvent, (event) => {
  console.log('Game state updated:', event.state)
})

// Later: cleanup
registrar.dispose()
```

### React Integration

```tsx
import { useEventListener } from '@lib/eventing/hooks'
import { UpdateGameStateEvent } from './events'

function GameScreen() {
  useEventListener(UpdateGameStateEvent, (event) => {
    // Update UI when game state changes
    setGameState(event.state)
  })
  
  return <div>...</div>
}
```

---

## Key Features

### 1. Type-Safe Events

All events extend `EventArgsBase` with static `eventType`:

```typescript
import { EventArgsBase } from '@lib/eventing'

export class PlayerActionEvent extends EventArgsBase {
  static readonly eventType = 'PlayerActionEvent'
  
  constructor(public readonly action: PlayerAction) {
    super()
  }
}
```

### 2. Request/Response Pattern

Use deferred promises for request/response:

```typescript
import { createOperationDeferred } from '@lib/eventing'

// Request side
const deferred = createOperationDeferred<PlayerProfile>()
await EventBus.instance.publishAsync(new GetLocalPlayerEvent(deferred))
const result = await deferred.promise

// Response side
registrar.subscribeAsync(GetLocalPlayerEvent, async (event) => {
  const player = await loadPlayer()
  event.deferred.resolve(OperationResult.success(player))
})
```

### 3. Event Queuing

Events are queued when no subscribers exist. Queued events replay when subscribers register (useful for late initialization).

### 4. Async Handling

`publishAsync` waits for async handlers. Configure timeout via options.

---

## Common Patterns

### Pattern 1: UI → Engine (Player Action)

```typescript
// UI publishes action
EventBus.instance.publish(new PlayerActionEvent(action))

// Engine subscribes and processes
registrar.subscribe(PlayerActionEvent, (event) => {
  engine.processAction(event.action)
  // Engine publishes state update
  EventBus.instance.publish(new UpdateGameStateEvent(newState))
})
```

### Pattern 2: AI → Engine (Request Game State)

```typescript
// AI requests game state
const deferred = createOperationDeferred<GameState>()
await EventBus.instance.publishAsync(new RequestGameStateEvent(deferred))
const state = await deferred.promise

// Engine handles request
registrar.subscribeAsync(RequestGameStateEvent, async (event) => {
  const state = engine.getGameState()
  event.deferred.resolve(OperationResult.success(state))
})
```

### Pattern 3: Engine → Solana (Submit Move)

```typescript
// Engine submits move
await EventBus.instance.publishAsync(new SubmitMoveToSolanaEvent(move))

// Solana handles submission
registrar.subscribeAsync(SubmitMoveToSolanaEvent, async (event) => {
  const tx = await solanaClient.submitMove(event.move)
  EventBus.instance.publish(new SolanaTransactionResultEvent(tx))
})
```

---

## API Reference

### EventBus

| Method | Purpose |
|--------|---------|
| `EventBus.instance` | Singleton instance |
| `publish(event)` | Publish event (sync handlers only) |
| `publishAsync(event, options?)` | Publish event (waits for async handlers) |
| `subscribe(type, handler)` | Subscribe to event type |
| `unsubscribe(type, handler)` | Unsubscribe from event type |

### EventRegistrar

| Method | Purpose |
|--------|---------|
| `createEventRegistrar()` | Create registrar (auto-cleanup) |
| `subscribe(type, handler)` | Subscribe to event |
| `subscribeAsync(type, handler)` | Subscribe with async handler |
| `dispose()` | Cleanup all subscriptions |

### React Hooks

| Hook | Purpose |
|------|---------|
| `useEventListener(type, handler)` | Subscribe in React component |
| `useEventBus()` | Get EventBus instance |
| `useEventRegistrar()` | Get EventRegistrar instance |

---

## Configuration

EventBus options (defaults):

```typescript
{
  queueBatchSize: 10,      // Items processed per flush
  maxRetryAttempts: 5,     // Retries before dropping queued event
  queueTimeoutMs: 5000,    // Timeout when replaying queued events
  eventTtlMs: 60000,       // Time-to-live for queued events
  asyncTimeoutMs: 10000,   // Timeout when awaiting async handlers
  maxQueuedEvents: 1000    // Max events in queue
}
```

---

## Testing

Use test helpers for isolated buses:

```typescript
import { createTestEventBus } from '@lib/eventing/testing'

const bus = createTestEventBus()
const registrar = new EventRegistrar(bus)
// ... test code
```

---

## When to Use

✅ **Use EventBus when:**
- Communicating between domains (UI, Engine, AI, Solana)
- Need decoupled, testable communication
- Need request/response pattern
- Need event queuing for late subscribers

❌ **Don't use EventBus when:**
- Direct function calls within same domain
- Simple state management (use React state or Zustand)
- Synchronous data flow within component

---

## Related Docs

- [../Architecture/event-driven-domains.md](../Architecture/event-driven-domains.md) - Event-driven architecture
- [../AILogic/ai-event-driven-pattern.md](../AILogic/ai-event-driven-pattern.md) - How AI uses EventBus
- `src/lib/eventing/README.md` - Full documentation with examples

---

**Last Updated:** 2025-01-20  
**Full Documentation:** `src/lib/eventing/README.md`

