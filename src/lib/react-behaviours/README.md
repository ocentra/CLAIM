# React Behaviours

`@lib/react-behaviours` provides a lightweight runtime for encapsulating stateful logic that lives alongside React components. Think of a “behaviour” as a small class with lifecycle hooks (`awake`, `onStart`, `onDestroy`), update loops, and state notification. This layer is used by `@lib/eventing/behaviours` but can also power other domains that need similar patterns.

---

## 1. Core Concepts

### 1.1 `ReactBehaviour`

Base class with lifecycle methods:

| Method            | When it fires                                              |
| ----------------- | ---------------------------------------------------------- |
| `awake`           | First initialisation; subscribe to events here.            |
| `onStart`         | Invoked when behaviour starts (after `enable`).            |
| `onEnable`/`onDisable` | Toggle when behaviour is enabled/disabled.            |
| `onUpdate`        | Called on each update tick if `startUpdateLoop` was used.  |
| `onLateUpdate`    | Runs after `onUpdate` within the same tick.                |
| `onDestroy`       | Cleanup logic, called from `destroy`.                      |

Behaviours hold a context object (`TContext`) if one is supplied, and expose `notifyStateChanged` for hooking into external observers.

### 1.2 `BehaviourHost`

React component that creates, starts, and destroys a behaviour automatically:

```tsx
import { BehaviourHost } from '@lib/react-behaviours'

<BehaviourHost
  create={() => new MyBehaviour()}
  autoStart={true}
  onReady={(behaviour) => {
    // optional callback once created
  }}
>
  {children}
</BehaviourHost>
```

### 1.3 Hooks

- `useBehaviour(factory, context?, options?)` – returns a behaviour instance bound to the component lifecycle.
- `useBehaviourState(factory, selector, context?, options?)` – subscribes to behaviour state via `notifyStateChanged`.

---

## 2. Creating a Behaviour

```ts
import { ReactBehaviour } from '@lib/react-behaviours'

interface PlayerState {
  score: number
  isReady: boolean
}

export class PlayerBehaviour extends ReactBehaviour {
  private state: PlayerState = { score: 0, isReady: false }

  get currentState(): PlayerState {
    return this.state
  }

  protected awake(): void {
    // Subscribe to external systems, register listeners, etc.
  }

  protected onStart(): void {
    this.loadInitialState()
  }

  protected onDestroy(): void {
    // Cleanup
  }

  private async loadInitialState() {
    this.state = { score: 10, isReady: true }
    this.notifyStateChanged()
  }
}
```

---

## 3. Using the Hooks

### 3.1 `useBehaviour`

```tsx
import { useBehaviour } from '@lib/react-behaviours'
import { PlayerBehaviour } from './PlayerBehaviour'

export function PlayerController() {
  const behaviour = useBehaviour(() => new PlayerBehaviour())

  useEffect(() => {
    behaviour.start()
  }, [behaviour])

  return null
}
```

`useBehaviour` creates the behaviour immediately (calling `awake`) and destroys it on unmount. By default it auto-starts; set `autoStart: false` in options to control it manually.

### 3.2 `useBehaviourState`

```tsx
import { useBehaviourState } from '@lib/react-behaviours'
import { PlayerBehaviour } from './PlayerBehaviour'

export function PlayerHUD() {
  const state = useBehaviourState(
    () => new PlayerBehaviour(),
    (behaviour) => behaviour.currentState
  )

  if (!state.isReady) return <div>Loading…</div>
  return <div>Score: {state.score}</div>
}
```

This hook wires `notifyStateChanged` into React, giving you a live view of the behaviour’s state.

---

## 4. Update Loops

Behaviours can schedule continuous updates:

```ts
protected onStart(): void {
  this.startUpdateLoop(30) // 30 FPS
}

protected onUpdate(deltaTime: number): void {
  // deltaTime is the elapsed time in ms since the last update
}

protected onDestroy(): void {
  this.stopUpdateLoop()
}
```

Internally, `BehaviourScheduler` manages update ticks using `requestAnimationFrame` (with a fallback to `setTimeout`).

---

## 5. Context Objects

You can pass contextual data when creating the behaviour:

```ts
type PlayerContext = { playerId: string }

const behaviour = useBehaviour(
  (context) => new PlayerBehaviour(context),
  { playerId: '123' }
)
```

Inside the behaviour:

```ts
constructor(context?: PlayerContext) {
  super(context)
  this.playerId = context?.playerId ?? 'unknown'
}
```

Behaviours created via `BehaviourHost` also receive the context you pass through the `context` prop.

---

## 6. Tips & Best Practices

- **Keep behaviours focused**: A behaviour should manage one slice of logic; compose multiple behaviours if needed.
- **Use `notifyStateChanged` sparingly**: Batch updates to avoid excessive React renders.
- **Cleanup**: Always call `stopUpdateLoop` and clean up subscriptions in `onDestroy`.
- **Optionally combine with EventBus**: Behaviours work well in tandem with `@lib/eventing` when you need bus-driven state.

---

Need more real-world examples? See `@lib/eventing/behaviours/README.md` for an event-driven variant built on top of this library. Contributions welcome—document reusable patterns here so others can adopt them quickly.
