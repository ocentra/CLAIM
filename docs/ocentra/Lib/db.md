# Database Library

**Purpose:** IndexedDB utilities for client-side database operations.

**Location:** `src/lib/db/`

---

## What It Provides

### 1. Base CRUD Class

**Location:** `src/lib/db/idbBase.ts`

```typescript
import { BaseCRUD } from '@lib/db'

export class PlayerModel extends BaseCRUD<Player> {
  constructor(id: string, label: string, dbWorker?: Worker) {
    super(id, label, dbWorker)
  }

  async update(updates: Partial<Player>): Promise<void> {
    // Update implementation
  }

  async delete(): Promise<void> {
    // Delete implementation
  }
}
```

**Features:**
- Base class for CRUD operations
- Static and instance methods
- Worker support for background operations

---

### 2. Schema Management

**Location:** `src/lib/db/idbSchema.ts`

```typescript
// Define database schema
const schema = {
  version: 1,
  stores: {
    players: { keyPath: 'id' },
    matches: { keyPath: 'matchId' },
  },
}
```

**Features:**
- Database schema definition
- Version management
- Store configuration

---

### 3. Model Definitions

**Location:** `src/lib/db/idbModel.ts`

```typescript
// Define model with schema
class PlayerModel extends BaseCRUD<Player> {
  static async create(data: Player): Promise<string> {
    // Create implementation
  }

  static async read(id: string): Promise<Player | null> {
    // Read implementation
  }
}
```

**Features:**
- Model definitions with CRUD operations
- Type-safe operations
- Async operations

---

## Common Patterns

### Pattern 1: CRUD Operations

```typescript
// Create
const id = await PlayerModel.create(playerData)

// Read
const player = await PlayerModel.read(id)

// Update
await playerModel.update({ score: 100 })

// Delete
await playerModel.delete()
```

---

## API Reference

| API | Purpose |
|-----|---------|
| `BaseCRUD<T>` | Base class for CRUD operations |
| `idbSchema` | Schema management utilities |
| `idbModel` | Model definition utilities |

---

## When to Use

✅ **Use DB when:**
- Need client-side database operations
- Need IndexedDB access
- Need persistent storage in browser

❌ **Don't use DB when:**
- Simple localStorage is sufficient
- Server-side storage preferred
- No persistence needed

---

## Related Docs

- [match-recording.md](./match-recording.md) - Match recording (may store in DB)
- [logging.md](./logging.md) - Logging (uses IndexedDB for storage)

---

**Last Updated:** 2025-01-20  
**Location:** `src/lib/db/`

