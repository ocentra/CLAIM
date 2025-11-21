# Core Utilities Library

**Purpose:** Core utility functions (GUID generation, timeout wrappers, service container pattern).

**Location:** `src/lib/core/`

---

## What It Provides

### 1. GUID Generation

**Location:** `src/lib/core/guid.ts`

```typescript
import { createGuid } from '@lib/core'

const id = createGuid()
// Returns: '550e8400-e29b-41d4-a716-446655440000'
```

**Features:**
- Uses `crypto.randomUUID()` if available
- Falls back to UUID v4-compatible generation
- Always returns valid UUID format

**Use when:** Need unique identifiers (match IDs, player IDs, etc.)

---

### 2. Promise Timeout Wrapper

**Location:** `src/lib/core/timeout.ts`

```typescript
import { withTimeout } from '@lib/core'

// Wrap promise with timeout
const result = await withTimeout(
  fetch('/api/data'),
  5000, // 5 second timeout
  'Request timed out'
)
```

**Features:**
- Automatically rejects if promise takes too long
- Cleans up timeout on success
- Customizable error message

**Use when:** Need to timeout async operations (API calls, EventBus publishAsync, etc.)

---

### 3. Service Container Pattern

**Location:** `src/lib/core/services/ServiceContainer.ts`

**Purpose:** Dependency injection container for services (singleton/transient lifecycle).

```typescript
import { ServiceContainer, createServiceKey } from '@lib/core'

// Create service key
const PlayerServiceKey = createServiceKey<PlayerService>('PlayerService')

// Create container
const container = new ServiceContainer()

// Register service (singleton)
container.register(PlayerServiceKey, (container) => {
  return new PlayerService()
}, { lifecycle: 'singleton' })

// Resolve service
const playerService = container.resolve(PlayerServiceKey)
```

**Features:**
- Singleton or transient lifecycle
- Parent containers (hierarchical)
- Disposal support
- Type-safe service keys

**Use when:** Need dependency injection for services (GameEngine, AIManager, etc.)

---

## API Reference

| API | Purpose |
|-----|---------|
| `createGuid()` | Generate UUID v4 |
| `withTimeout(promise, timeoutMs, message?)` | Wrap promise with timeout |
| `createServiceKey<T>(description?)` | Create service key |
| `ServiceContainer` | Dependency injection container |
| `ServiceProvider` | React provider for service container |

---

## Common Patterns

### Pattern 1: Generate Unique IDs

```typescript
import { createGuid } from '@lib/core'

const matchId = createGuid()
const playerId = createGuid()
```

### Pattern 2: Timeout API Calls

```typescript
import { withTimeout } from '@lib/core'

try {
  const data = await withTimeout(
    fetch('/api/match-state'),
    10000,
    'Match state request timed out'
  )
} catch (error) {
  // Handle timeout or other errors
}
```

### Pattern 3: Service Container

```typescript
import { ServiceContainer, createServiceKey } from '@lib/core'

// Define service keys
const GameEngineKey = createServiceKey<GameEngine>('GameEngine')
const AIManagerKey = createServiceKey<AIManager>('AIManager')

// Create and configure container
const container = new ServiceContainer()
container.register(GameEngineKey, () => new GameEngine())
container.register(AIManagerKey, (c) => {
  const engine = c.resolve(GameEngineKey)
  return new AIManager(engine)
})

// Use in app
const engine = container.resolve(GameEngineKey)
```

---

## When to Use

✅ **Use Core Utilities when:**
- Need unique identifiers (GUID)
- Need to timeout promises
- Need dependency injection (service container)

❌ **Don't use Core Utilities when:**
- Simple UUID generation (use `crypto.randomUUID()` directly)
- No timeout needed (use promise directly)
- Simple object creation (no DI needed)

---

## Related Docs

- [eventbus.md](./eventbus.md) - EventBus (uses withTimeout for async operations)

---

**Last Updated:** 2025-01-20  
**Location:** `src/lib/core/`

