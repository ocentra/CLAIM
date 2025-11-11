# Eventing Library

The `@lib/eventing` package provides the runtime for message–driven communication in the app.  
It contains:

- `EventBus` – central hub for publishing and subscribing to events
- Event contracts (`EventArgsBase`, interfaces) – strongly typed payloads
- `EventRegistrar` – utility for registering/unregistering listeners with lifetime management
- React bindings (`EventBusProvider`, hooks, behaviours)
- Helpers (`createDeferred`, `createEventRegistrar`, etc.)

This document explains how to use those pieces together with practical examples.

---

## 1. Getting Started

### 1.1 Creating an Event

All events extend `EventArgsBase`. Provide a static `eventType` and any payload fields you need.

```ts
import { EventArgsBase } from '@lib/eventing'

export interface PlayerJoinedPayload {
  playerId: string
  displayName: string
}

export class PlayerJoinedEvent extends EventArgsBase {
  static readonly eventType = 'PlayerJoinedEvent'

  constructor(public readonly payload: PlayerJoinedPayload) {
    super()
    this.isRePublishable = false // optional; default false
  }
}
```

### 1.2 Registering the Event Bus in React

Wrap the part of the tree that needs events with `EventBusProvider`.  
By default it uses the singleton bus (`EventBus.instance`), but you can inject your own instance.

```tsx
import { EventBusProvider } from '@lib/eventing/hooks/EventBusProvider'

export function App() {
  return (
    <EventBusProvider>
      {/* the rest of your app */}
    </EventBusProvider>
  )
}
```

---

## 2. Subscribing to Events

### 2.1 Using the Registrar (recommended in non-React code)

```ts
import { EventRegistrar, createEventRegistrar } from '@lib/eventing'
import { PlayerJoinedEvent } from './PlayerJoinedEvent'

const registrar: EventRegistrar = createEventRegistrar()

registrar.subscribe(PlayerJoinedEvent, (event) => {
  console.log('Player joined', event.payload)
})

// Later, when you no longer need the subscriptions:
registrar.dispose()
```

`createEventRegistrar` automatically points to the singleton bus.  
If you need a custom bus instance (e.g., for tests), instantiate `new EventRegistrar(customBus)`.

### 2.2 Hooks inside React

```tsx
import { useEventListener } from '@lib/eventing/hooks'
import { PlayerJoinedEvent } from './PlayerJoinedEvent'

export function PlayerToast() {
  useEventListener(PlayerJoinedEvent, ({ payload }) => {
    // show toast, update state, etc.
  })

  return null
}
```

The hook automatically subscribes on mount and unsubscribes on unmount.

### 2.3 Event Behaviours (stateful React wrappers)

See `./behaviours/README.md` for a deep dive. Behaviours are best when you need:

- Internal lifecycle (`awake`, `onStart`, `onDestroy`)
- Polling or scheduled updates (`startUpdateLoop`)
- React state binding via `useEventBehaviour` / `useEventBehaviourState`

---

## 3. Publishing Events

```ts
import { EventBus, OperationResult } from '@lib/eventing'
import { PlayerJoinedEvent } from './PlayerJoinedEvent'

const bus = EventBus.instance

async function notifyPlayerJoin(payload: PlayerJoinedPayload): Promise<OperationResult<boolean>> {
  return bus.publish(new PlayerJoinedEvent(payload))
}
```

`publish` waits for synchronous subscribers. To wait for async subscribers, use `publishAsync`.

```ts
const result = await bus.publishAsync(new PlayerJoinedEvent(payload), {
  timeoutMs: 5000, // optional custom timeout (defaults to 10s)
})

if (!result.isSuccess) {
  console.error(result.errorMessage)
}
```

---

## 4. Request/Response Patterns

Sometimes you need to broadcast a request and await a response.  
Use `createOperationDeferred` to bundle a promise with the event.

### 4.1 Event Definition

```ts
import { EventArgsBase, createOperationDeferred, type OperationDeferred } from '@lib/eventing'
import type { PlayerProfile } from './types'

export class GetLocalPlayerEvent extends EventArgsBase {
  static readonly eventType = 'GetLocalPlayerEvent'
  constructor(public readonly deferred: OperationDeferred<PlayerProfile>) {
    super()
  }
}
```

### 4.2 Publishing and Awaiting

```ts
const deferred = createOperationDeferred<PlayerProfile>()

const publishResult = await bus.publishAsync(new GetLocalPlayerEvent(deferred))
if (!publishResult.isSuccess) {
  // no listeners handled the request
  return null
}

const result = await deferred.promise
if (result.isSuccess) {
  return result.value
}

throw new Error(result.errorMessage ?? 'Unknown player error')
```

### 4.3 Handling the Request

```ts
registrar.subscribeAsync(GetLocalPlayerEvent, async (event) => {
  try {
    const player = await loadPlayer()
    event.deferred.resolve(OperationResult.success(player))
  } catch (error) {
    event.deferred.resolve(
      OperationResult.failure(error instanceof Error ? error.message : 'PLAYER_LOOKUP_FAILED')
    )
  }
})
```

---

## 5. Awaiting Multiple Subscribers

`publishAsync` invokes async subscribers sequentially.  
If you want parallel fan-out (fire-and-forget), call `publish` and handle async tasks inside the subscriber itself (e.g., `void doAsyncWork()`).

```ts
registrar.subscribe(PlayerJoinedEvent, (event) => {
  void sendWelcomeEmail(event.payload.playerId) // intentionally not awaited
})
```

---

## 6. Queuing & Retry Behaviour

The bus automatically queues events when published with no active subscribers and the event is not marked `isRePublishable`. Queued events will replay once a subscriber registers.

Important defaults (configurable via `EventBusOptions`):

| Option                | Default | Description                                               |
| --------------------- | ------- | --------------------------------------------------------- |
| `queueBatchSize`      | 10      | Items processed per flush                                 |
| `maxRetryAttempts`    | 5       | Retries before dropping a queued event                    |
| `queueTimeoutMs`      | 5000    | Timeout when replaying queued events                      |
| `eventTtlMs`          | 60000   | Time-to-live for queued events                            |
| `asyncTimeoutMs`      | 10000   | Timeout when awaiting async subscribers via `publishAsync` |

To instantiate a bus with custom options:

```ts
const bus = new EventBus(
  { asyncTimeoutMs: 15000, maxQueuedEvents: 200 },
  createEventLogger('NETWORK')
)
EventBus.configure(bus) // make it the singleton if needed
```

---

## 7. Logging

`EventBus` and `EventRegistrar` use the shared logging system via `createEventLogger`.  
To adjust verbosity, toggle `LOG_FLAGS` in `@lib/logging/logger.ts`.

```ts
import { createEventLogger } from '@lib/eventing'
const logger = createEventLogger('GAME_ENGINE', '[CardDeck]')
logger.logInfo('Deck initialised')
```

---

## 8. Testing

Use the helpers in `@lib/eventing/testing` (e.g., `createTestEventBus`) to get isolated buses for unit tests.

```ts
import { createTestEventBus } from '@lib/eventing/testing'
import { EventRegistrar } from '@lib/eventing'

it('publishes player events', async () => {
  const bus = createTestEventBus()
  const registrar = new EventRegistrar(bus)
  const handled: string[] = []

  registrar.subscribe(PlayerJoinedEvent, (event) => handled.push(event.payload.playerId))

  await bus.publish(new PlayerJoinedEvent({ playerId: '123', displayName: 'Alice' }))

  expect(handled).toEqual(['123'])
})
```

---

## 9. Recommended Patterns

- **Feature encapsulation** – Define events near the feature that owns them, export only what other domains require.
- **Strong typing** – Always include a static `eventType` to avoid name collisions and support queued delivery.
- **Error handling** – Wrap asynchronous subscribers in try/catch and report errors via `OperationResult.failure`.
- **Cleanup** – Call `dispose` on `EventRegistrar` instances to prevent memory leaks (React hooks do this automatically).
- **Docs** – If you build reusable behaviours, document them alongside `behaviours/README.md` so other teams can copy patterns.

---

## 10. Quick Reference

| Task                                | API / Helper                                    |
| ----------------------------------- | ----------------------------------------------- |
| Publish event                       | `EventBus.publish`, `EventBus.publishAsync`     |
| Subscribe / unsubscribe             | `EventRegistrar.subscribe`, `.unsubscribe`      |
| Await response from subscribers     | `createOperationDeferred`, `OperationResult`    |
| React integration                   | `EventBusProvider`, `useEventBus`, `useEventListener`, `useEventBehaviour` |
| Create prefixed logger              | `createEventLogger`                             |
| Generate GUID                       | `createGuid` (from `@lib/core`)                 |
| Timeout any promise                 | `withTimeout` (from `@lib/core`)                |
