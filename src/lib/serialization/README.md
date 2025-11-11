# Serialization Library

`@lib/serialization` offers decorators and helpers to mark classes as serializable, enforce schema versions, migrate data, and perform deep cloning / freezing. It is especially useful for persisting game layouts, editor state, or any object graph that needs to survive across sessions.

This README walks through the main APIs and how to integrate them.

---

## 1. Overview

| API / Type                | Purpose                                                                      |
| ------------------------- | ---------------------------------------------------------------------------- |
| `serializable` decorator  | Marks class fields as serializable with optional metadata (labels, min/max). |
| `serialize(instance)`     | Converts a decorated class instance into a JSON-friendly object.             |
| `deserialize(Class, data)` | Instantiates the class from serialized data (with optional migration).     |
| `configureSerialization`  | Adjust runtime options (deep clone, freeze results).                         |
| `getSerializableFields`   | Introspect metadata (useful for editors or tooling).                         |
| `SCHEMA_VERSION_KEY`      | Constant used to track version numbers during serialization.                 |

---

## 2. Decorating a Class

```ts
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

- `serializable` stores metadata via `reflect-metadata`. Ensure `import 'reflect-metadata'` is executed once (already done inside `Serializable.ts`).
- Options can include `label`, `min`, `max`, `step`, `group`, `inputType`, etc. These are primarily for UI introspection.

---

## 3. Serializing and Deserializing

```ts
import { serialize, deserialize } from '@lib/serialization'

const player = new PlayerSettings()
player.volume = 85

const raw = serialize(player)
// raw is a plain object safe to persist (e.g., JSON.stringify)

const restored = deserialize(PlayerSettings, raw)
// restored is a new PlayerSettings instance with volume = 85
```

Behind the scenes:

- `serialize` respects metadata, deep clones the object, and records `schemaVersion` (if provided).
- `deserialize` deep clones inputs, applies migrations when schema versions mismatch, and rehydrates decorated fields.

---

## 4. Schema Versions & Migration

Add a static `schemaVersion` to your class. Optionally provide a `migrate` function that accepts the raw serialized data when versions differ.

```ts
@serializable()
export class LayoutConfig {
  static schemaVersion = 2

  @serializable({ label: 'Table Size' })
  tableSize = 8

  @serializable({ label: 'Theme', optional: true })
  theme?: string

  static migrate(data: Record<string, unknown>) {
    if (data.__schemaVersion === 1) {
      // Example: rename property from "tableCount" -> "tableSize"
      if (typeof data.tableCount === 'number' && data.tableSize === undefined) {
        data.tableSize = data.tableCount
        delete data.tableCount
      }
    }
    data.__schemaVersion = LayoutConfig.schemaVersion
    return data
  }
}
```

When `deserialize(LayoutConfig, raw)` sees a different `__schemaVersion`, it calls `migrate` (if defined). You are responsible for updating the schema version inside the migration result.

---

## 5. Array and Nested Types

Use `elementType` to automatically deserialize array entries:

```ts
export class Deck {
  @serializable({ elementType: Card })
  cards: Card[] = []
}
```

If you omit `elementType`, arrays are cloned as plain values. When provided, `deserialize` recursively rehydrates each entry using the constructor.

---

## 6. Runtime Options

`configureSerialization` allows you to adjust three flags:

```ts
import { configureSerialization } from '@lib/serialization'

configureSerialization({
  deepClone: false,       // skip deep cloning (useful for performance, but mutates original)
  freezeResults: false,   // do not freeze serialized output
  freezeInstances: true,  // freeze deserialized class instances
})
```

Defaults:

- `deepClone`: true
- `freezeResults`: true
- `freezeInstances`: false

---

## 7. Inspecting Metadata

`getSerializableFields` returns raw metadata for generating editors or inspector UIs:

```ts
import { getSerializableFields } from '@lib/serialization'

const fields = getSerializableFields(PlayerSettings)
// [{ key: 'name', options: { label: 'Display Name' }, defaultValue: 'Anonymous', ... }, ...]
```

Each entry contains the original default value, options, and design type.

---

## 8. Testing & Utilities

- **Tests**: There’s an example spec in `__tests__/Serializable.spec.ts` demonstrating edge cases.
- **Helpers**: `Serializable.ts` exposes `SCHEMA_VERSION_KEY` for reading/writing version markers.
- **Deep clones**: Use the serializer to clone decorated objects safely (especially when classes contain nested serializable classes).

---

## 9. Tips

- Always update `schemaVersion` when changing the shape of serialized data, and implement a migration path.
- Keep migrations idempotent (safe to run multiple times).
- Remember to call `serialize` before storing to IndexedDB or sending over the network; never store class instances directly.
- Consider freezing instances (`freezeInstances`) in read-only contexts to catch accidental mutation.

---

Expand this README with additional patterns (e.g., diffing serialized output, patching) as they emerge.
