# React Behaviours Library

**Purpose:** React lifecycle management system inspired by Unity's MonoBehaviour. Provides lifecycle hooks, update loops, and state management tied to React component lifecycle.

**Location:** `src/lib/react-behaviours/ReactBehaviour.ts`

**Full Documentation:** `src/lib/react-behaviours/README.md` (detailed usage guide)

---

## What It Does

ReactBehaviours provide a class-based approach to React component logic with lifecycle management:
- **Lifecycle hooks:** awake, onStart, onUpdate, onLateUpdate, onDestroy
- **Update loops:** Scheduled updates (FPS-based)
- **State management:** notifyStateChanged for React integration
- **Context support:** Pass context to behaviours

**Pattern:** Similar to Unity's MonoBehaviour lifecycle, but for React components.

---

## Quick Start

### Creating a Behaviour

```typescript
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
    // First initialization - subscribe to events, etc.
  }

  protected onStart(): void {
    // Called after enable() - start logic here
    this.loadInitialState()
  }

  protected onUpdate(deltaTime: number): void {
    // Called every update tick (if update loop started)
  }

  protected onDestroy(): void {
    // Cleanup - unsubscribe, stop loops, etc.
  }

  private async loadInitialState() {
    this.state = { score: 10, isReady: true }
    this.notifyStateChanged() // Notify React to re-render
  }
}
```

### Using with React Hook

```tsx
import { useBehaviour } from '@lib/react-behaviours'
import { PlayerBehaviour } from './PlayerBehaviour'

function PlayerController() {
  const behaviour = useBehaviour(() => new PlayerBehaviour(), {
    autoStart: true // Auto-start on mount
  })

  useEffect(() => {
    // Behaviour is already started (if autoStart: true)
    // Or manually: behaviour.start()
  }, [behaviour])

  return null
}
```

### Using with State Hook

```tsx
import { useBehaviourState } from '@lib/react-behaviours'
import { PlayerBehaviour } from './PlayerBehaviour'

function PlayerHUD() {
  const state = useBehaviourState(
    () => new PlayerBehaviour(),
    (behaviour) => behaviour.currentState // Selector
  )

  if (!state.isReady) return <div>Loading...</div>
  return <div>Score: {state.score}</div>
}
```

---

## Key Features

### 1. Lifecycle Hooks

| Hook | When It Fires |
|------|---------------|
| `awake()` | First initialization (before start) |
| `onStart()` | When behaviour starts (after enable) |
| `onEnable()` | When behaviour is enabled |
| `onDisable()` | When behaviour is disabled |
| `onUpdate(deltaTime)` | Each update tick (if update loop active) |
| `onLateUpdate(deltaTime)` | After onUpdate in same tick |
| `onDestroy()` | Cleanup (called from destroy) |

### 2. Update Loops

Start a continuous update loop:

```typescript
protected onStart(): void {
  this.startUpdateLoop(30) // 30 FPS
}

protected onUpdate(deltaTime: number): void {
  // deltaTime in milliseconds since last update
}

protected onDestroy(): void {
  this.stopUpdateLoop()
}
```

### 3. State Notifications

Notify React when state changes:

```typescript
private updateScore(newScore: number) {
  this.state.score = newScore
  this.notifyStateChanged() // Triggers React re-render
}
```

### 4. Context Support

Pass context when creating behaviour:

```typescript
type PlayerContext = { playerId: string }

const behaviour = useBehaviour(
  (context) => new PlayerBehaviour(context),
  { playerId: '123' }
)
```

---

## Common Patterns

### Pattern 1: Event-Driven Behaviour

```typescript
import { EventRegistrar } from '@lib/eventing'
import { ReactBehaviour } from '@lib/react-behaviours'

export class GameStateBehaviour extends ReactBehaviour {
  private registrar = createEventRegistrar()
  private state: GameState | null = null

  protected awake(): void {
    // Subscribe to game state updates
    this.registrar.subscribe(UpdateGameStateEvent, (event) => {
      this.state = event.state
      this.notifyStateChanged()
    })
  }

  protected onDestroy(): void {
    this.registrar.dispose() // Cleanup subscriptions
  }

  get currentState(): GameState | null {
    return this.state
  }
}
```

### Pattern 2: Polling Behaviour

```typescript
export class NetworkStatusBehaviour extends ReactBehaviour {
  private isConnected = false

  protected onStart(): void {
    this.startUpdateLoop(1) // Check every second
  }

  protected onUpdate(deltaTime: number): void {
    this.checkConnection()
  }

  private async checkConnection() {
    const connected = await pingServer()
    if (connected !== this.isConnected) {
      this.isConnected = connected
      this.notifyStateChanged()
    }
  }
}
```

### Pattern 3: Behaviour with Update Loop

```typescript
export class TimerBehaviour extends ReactBehaviour {
  private timeElapsed = 0

  protected onStart(): void {
    this.startUpdateLoop(60) // 60 FPS
  }

  protected onUpdate(deltaTime: number): void {
    this.timeElapsed += deltaTime
    this.notifyStateChanged()
  }

  get elapsed(): number {
    return this.timeElapsed
  }
}
```

---

## API Reference

### ReactBehaviour

| Method | Purpose |
|--------|---------|
| `awake()` | First initialization (override) |
| `onStart()` | Called when started (override) |
| `onUpdate(deltaTime)` | Called each update tick (override) |
| `onDestroy()` | Cleanup logic (override) |
| `start()` | Start behaviour |
| `destroy()` | Destroy behaviour |
| `enable()` / `disable()` | Toggle enabled state |
| `startUpdateLoop(fps)` | Start update loop |
| `stopUpdateLoop()` | Stop update loop |
| `notifyStateChanged()` | Notify React to re-render |

### Hooks

| Hook | Purpose |
|------|---------|
| `useBehaviour(factory, context?, options?)` | Create behaviour instance |
| `useBehaviourState(factory, selector, context?, options?)` | Subscribe to behaviour state |

### BehaviourHost Component

```tsx
<BehaviourHost
  create={() => new MyBehaviour()}
  autoStart={true}
  context={{ playerId: '123' }}
  onReady={(behaviour) => {
    // Optional callback
  }}
>
  {children}
</BehaviourHost>
```

---

## When to Use

✅ **Use ReactBehaviours when:**
- Need lifecycle hooks (awake, onStart, onUpdate, onDestroy)
- Need update loops (scheduled updates)
- Need state management tied to component lifecycle
- Prefer class-based approach over hooks

❌ **Don't use ReactBehaviours when:**
- Simple component logic (use hooks directly)
- No lifecycle management needed
- Pure presentational components

---

## Related Docs

- [eventbus.md](./eventbus.md) - EventBus (often used with behaviours)
- `src/lib/react-behaviours/README.md` - Full documentation with examples
- `src/lib/eventing/behaviours/README.md` - Event-driven behaviours

---

**Last Updated:** 2025-01-20  
**Full Documentation:** `src/lib/react-behaviours/README.md`

