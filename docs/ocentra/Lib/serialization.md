# Serialization Library

**Purpose:** Decorator-based serialization system for persisting class instances. Used for GameMode assets, layouts, and any object graph that needs to survive across sessions.

**Location:** `src/lib/serialization/Serializable.ts`

**Full Documentation:** `src/lib/serialization/README.md` (detailed usage guide)

---

## What It Does

Serialization library provides:
- **Decorator-based serialization:** Mark fields with `@serializable()`
- **Schema versioning:** Track versions and migrate data
- **Deep cloning:** Safe object copying
- **Freezing:** Immutable instances
- **Introspection:** Query metadata for editors

**Key Use Case:** GameMode asset system uses this for serializing/deserializing `.asset` files.

---

## Quick Start

### Decorating a Class

```typescript
import { serializable } from '@lib/serialization'

export class PlayerSettings {
  @serializable({ label: 'Display Name' })
  name = 'Anonymous'

  @serializable({ label: 'Sound Volume', min: 0, max: 100 })
  volume = 70

  @serializable({ label: 'Favorite Deck', optional: true })
  deckId?: string
}
```

### Serializing and Deserializing

```typescript
import { serialize, deserialize } from '@lib/serialization'

const player = new PlayerSettings()
player.volume = 85

// Serialize to plain object
const raw = serialize(player)
// { name: 'Anonymous', volume: 85, deckId: undefined }

// Deserialize back to instance
const restored = deserialize(PlayerSettings, raw)
// PlayerSettings instance with volume = 85
```

### Schema Versioning

```typescript
export class LayoutConfig {
  static schemaVersion = 2

  @serializable({ label: 'Table Size' })
  tableSize = 8

  static migrate(data: Record<string, unknown>) {
    if (data.__schemaVersion === 1) {
      // Migrate from version 1 to 2
      if (typeof data.tableCount === 'number') {
        data.tableSize = data.tableCount
        delete data.tableCount
      }
    }
    data.__schemaVersion = LayoutConfig.schemaVersion
    return data
  }
}
```

---

## Key Features

### 1. Decorator Options

```typescript
@serializable({
  label: 'Display Name',        // UI label
  min: 0,                       // Min value (for numbers)
  max: 100,                     // Max value (for numbers)
  step: 1,                      // Step value (for numbers)
  group: 'Settings',            // Group for UI organization
  inputType: 'number',          // UI input type
  elementType: Card,            // Array element type
  optional: true                // Optional field
})
```

### 2. Array Types

```typescript
export class Deck {
  @serializable({ elementType: Card })
  cards: Card[] = []
}
```

### 3. Runtime Options

```typescript
import { configureSerialization } from '@lib/serialization'

configureSerialization({
  deepClone: false,       // Skip deep cloning
  freezeResults: false,   // Don't freeze serialized output
  freezeInstances: true,  // Freeze deserialized instances
})
```

### 4. Metadata Introspection

```typescript
import { getSerializableFields } from '@lib/serialization'

const fields = getSerializableFields(PlayerSettings)
// [{ key: 'name', options: { label: 'Display Name' }, defaultValue: 'Anonymous', ... }, ...]
```

---

## Common Patterns

### Pattern 1: GameMode Asset Serialization

```typescript
import { serializable } from '@lib/serialization'
import { Serializable } from './Serializable'

export class GameModeAsset extends Serializable {
  @serializable({ label: 'Game ID' })
  gameId: string = ''

  @serializable({ label: 'Display Name' })
  displayName: string = ''

  @serializable({ label: 'Max Players' })
  maxPlayers: number = 4

  static schemaVersion = 1

  // Serialize for saving
  toJSON() {
    return serialize(this)
  }

  // Deserialize from loaded data
  static fromJSON(data: Record<string, unknown>) {
    return deserialize(GameModeAsset, data)
  }
}
```

### Pattern 2: Nested Objects

```typescript
export class GameRules {
  @serializable({ label: 'LLM Rules' })
  LLM: string = ''

  @serializable({ label: 'Player Rules' })
  Player: string = ''
}

export class GameMode {
  @serializable({ label: 'Game Rules' })
  rules: GameRules = new GameRules()
}
```

### Pattern 3: Schema Migration

```typescript
export class LayoutPreset {
  static schemaVersion = 3

  @serializable()
  tableWidth: number = 800

  static migrate(data: Record<string, unknown>) {
    // Migrate from version 1
    if (data.__schemaVersion === 1) {
      // Old field name
      if ('width' in data && typeof data.width === 'number') {
        data.tableWidth = data.width
        delete data.width
      }
    }
    // Migrate from version 2
    if (data.__schemaVersion === 2) {
      // Some other migration
    }
    data.__schemaVersion = LayoutPreset.schemaVersion
    return data
  }
}
```

---

## API Reference

| API | Purpose |
|-----|---------|
| `@serializable(options?)` | Decorator to mark field as serializable |
| `serialize(instance)` | Convert instance to plain object |
| `deserialize(Class, data)` | Create instance from plain object |
| `configureSerialization(options)` | Adjust runtime options |
| `getSerializableFields(Class)` | Get metadata for class |
| `SCHEMA_VERSION_KEY` | Constant for schema version key |

---

## When to Use

✅ **Use Serialization when:**
- Persisting class instances (GameMode assets, layouts, settings)
- Need schema versioning and migration
- Need deep cloning
- Building editor tools (introspection)
- Saving/loading game state

❌ **Don't use Serialization when:**
- Simple JSON serialization (use `JSON.stringify` directly)
- No versioning needed
- Plain objects (not class instances)

---

## Related Docs

- [../GameData/GameMode-Asset-System-Plan.md](../GameData/GameMode-Asset-System-Plan.md) - GameMode asset system (uses Serialization)
- [../Phases/phase-01-core-serializable-foundation.md](../Phases/phase-01-core-serializable-foundation.md) - Phase that uses Serialization
- `src/lib/serialization/README.md` - Full documentation with examples

---

**Last Updated:** 2025-01-20  
**Full Documentation:** `src/lib/serialization/README.md`

