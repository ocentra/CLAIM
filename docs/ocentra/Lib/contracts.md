# Contracts Library

**Purpose:** Runtime contract checking for validating object shapes. Provides runtime type checking without relying solely on TypeScript's static analysis.

**Location:** `src/lib/contracts/Interface.ts`

**Full Documentation:** `src/lib/contracts/README.md` (detailed usage guide)

---

## What It Does

Contracts library provides:
- **Interface specifications:** Define expected object shapes
- **Runtime validation:** Check objects against specs
- **Type guards:** Assert types at runtime
- **Production optimization:** Disabled in production builds

**Key Use Case:** Validating API responses, untrusted data, or complex class invariants.

---

## Quick Start

### Defining an Interface Spec

```typescript
import type { InterfaceSpec } from '@lib/contracts'

export const PlayerContract: InterfaceSpec = {
  id: 'string',
  displayName: 'string',
  chips: {
    type: 'number',
    predicate: (value) => value >= 0,
  },
  metadata: {
    type: 'object',
    optional: true,
  },
}
```

### Asserting at Runtime

```typescript
import { assertImplements } from '@lib/contracts'
import { PlayerContract } from './contracts'

function createPlayer(data: unknown) {
  assertImplements(data, 'Player', PlayerContract)
  // Safe to use data as Player here
  return data as Player
}
```

### Checking Without Throwing

```typescript
import { implementsInterface } from '@lib/contracts'

if (implementsInterface(candidate, PlayerContract)) {
  // Valid - use candidate
} else {
  // Invalid - handle error
}
```

---

## Key Features

### 1. Interface Specifications

```typescript
export const GameStateContract: InterfaceSpec = {
  id: 'string',
  phase: {
    type: 'string',
    predicate: (value) => ['DEALING', 'PLAYER_ACTION', 'GAME_END'].includes(value),
  },
  currentPlayer: {
    type: 'number',
    predicate: (value) => value >= 0,
  },
  players: {
    type: 'array',
    elementContract: PlayerContract,
  },
}
```

### 2. Composing Specs

```typescript
import { composeInterfaceSpecs } from '@lib/contracts'

const BasePlayer = { id: 'string', displayName: 'string' }
const Stats = { gamesPlayed: 'number', wins: 'number' }

export const PlayerWithStats = composeInterfaceSpecs(BasePlayer, Stats)
```

### 3. Attaching to Classes

```typescript
import { registerInterface } from '@lib/contracts'

class PlayerModel {
  constructor(public readonly state: Player) {}
}

registerInterface(PlayerModel, PlayerContract)

// Later: assert
import { assertRegisteredInterface } from '@lib/contracts'
assertRegisteredInterface(model, 'PlayerModel')
```

### 4. Runtime Configuration

```typescript
import { setRuntimeContractsEnabled, areRuntimeContractsEnabled } from '@lib/contracts'

// Disable in tests or performance-sensitive code
setRuntimeContractsEnabled(false)

// Check current state
if (areRuntimeContractsEnabled()) {
  // Contracts are enabled
}
```

---

## Common Patterns

### Pattern 1: API Response Validation

```typescript
import { assertImplements } from '@lib/contracts'

async function fetchPlayerProfile(id: string): Promise<PlayerProfile> {
  const response = await fetch(`/api/players/${id}`)
  const data = await response.json()
  
  // Validate API response
  assertImplements(data, 'PlayerProfile', PlayerProfileContract)
  
  return data as PlayerProfile
}
```

### Pattern 2: Untrusted Data Validation

```typescript
function processUserInput(input: unknown): UserAction {
  // Validate untrusted input
  if (!implementsInterface(input, UserActionContract)) {
    throw new Error('Invalid user action')
  }
  
  return input as UserAction
}
```

### Pattern 3: Class Invariant Checking

```typescript
class GameEngine {
  private state: GameState

  setState(newState: unknown) {
    // Validate state shape
    assertImplements(newState, 'GameState', GameStateContract)
    this.state = newState as GameState
  }
}
```

---

## API Reference

| API | Purpose |
|-----|---------|
| `InterfaceSpec` | Type for interface specifications |
| `assertImplements(data, name, spec)` | Assert object implements spec (throws) |
| `implementsInterface(data, spec)` | Check object implements spec (returns boolean) |
| `composeInterfaceSpecs(...specs)` | Compose multiple specs |
| `registerInterface(Class, spec)` | Register spec on class |
| `assertRegisteredInterface(instance, className)` | Assert instance implements registered spec |
| `setRuntimeContractsEnabled(enabled)` | Enable/disable contracts |
| `areRuntimeContractsEnabled()` | Check if contracts enabled |

---

## When to Use

✅ **Use Contracts when:**
- Validating API responses
- Validating untrusted data (user input, localStorage)
- Guarding complex class invariants
- Need runtime type checking beyond TypeScript

❌ **Don't use Contracts when:**
- TypeScript static analysis is sufficient
- Performance-critical code (disable contracts)
- Simple validation (use direct checks)

---

## Related Docs

- [eventbus.md](./eventbus.md) - EventBus (may use contracts for event validation)
- `src/lib/contracts/README.md` - Full documentation with examples

---

**Last Updated:** 2025-01-20  
**Full Documentation:** `src/lib/contracts/README.md`

