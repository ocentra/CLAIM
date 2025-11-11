# Contracts Library

`@lib/contracts` provides lightweight runtime contract checking utilities. They are especially useful during development to ensure objects conform to expected shapes without relying solely on TypeScript’s static analysis. Contracts can be disabled automatically in production builds to avoid runtime overhead.

---

## 1. Overview

| Module       | Purpose                                                                                         |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `Interface.ts` | Define interface specifications and validate / assert objects against them.                    |
| `Implements.ts` | Helper to register interface specs on prototype constructors for later assertion.             |
| `index.ts`   | Re-exports the public API (`assertImplements`, `implementsInterface`, etc.).                    |

---

## 2. Quick Start

### 2.1 Defining an interface specification

```ts
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

Each property can be either a primitive type string (`'string'`, `'number'`, etc.) or a descriptor object `{ type, optional, predicate }`.

### 2.2 Asserting at runtime

```ts
import { assertImplements } from '@lib/contracts'
import { PlayerContract } from './contracts'

function createPlayer(data: unknown) {
  assertImplements(data, 'Player', PlayerContract)
  // safe to use data as Player here
  return data as Player
}
```

If the object fails validation, `assertImplements` throws with a descriptive error (missing property, wrong type, failed predicate, etc.).

### 2.3 Checking without throwing

```ts
import { implementsInterface } from '@lib/contracts'

if (implementsInterface(candidate, PlayerContract)) {
  // valid
} else {
  // invalid
}
```

`implementsInterface` returns a boolean rather than throwing.

---

## 3. Composing specs

Use `composeInterfaceSpecs` to merge multiple pieces:

```ts
import { composeInterfaceSpecs } from '@lib/contracts'

const BasePlayer = { id: 'string', displayName: 'string' }
const Stats = { gamesPlayed: 'number', wins: 'number' }

export const PlayerWithStats = composeInterfaceSpecs(BasePlayer, Stats)
```

Later specs take precedence for overlapping keys.

---

## 4. Attaching contracts to classes

`Implements.ts` provides a decorator-like helper so you can assert contracts on class instances:

```ts
import { registerInterface } from '@lib/contracts'
import { PlayerContract } from './contracts'

interface Player {
  id: string
  displayName: string
  chips: number
}

class PlayerModel {
  constructor(public readonly state: Player) {}
}

registerInterface(PlayerModel, PlayerContract)
```

Later you can ensure instances implement the contract:

```ts
import { assertRegisteredInterface } from '@lib/contracts'

function ensurePlayer(model: unknown) {
  assertRegisteredInterface(model, 'PlayerModel')
  return model as PlayerModel
}
```

Check `Implements.ts` for additional helpers (listing registered interfaces, etc.).

---

## 5. Enabling / disabling at runtime

By default contracts are **enabled** in non-production environments (based on `process.env.NODE_ENV` or `import.meta.env.MODE`) and disabled in production.

- Force enable/disable at runtime:

```ts
import { setRuntimeContractsEnabled } from '@lib/contracts'

setRuntimeContractsEnabled(false)
```

This is useful for tests or performance-sensitive scenarios.

- To check the current state:

```ts
import { areRuntimeContractsEnabled } from '@lib/contracts'
```

---

## 6. Tips

- Use contracts for untrusted inputs (API responses, local storage) or to guard complex class invariants.
- Remember to wrap assertions in try/catch if you need to recover gracefully.
- Keep specs close to the models they describe (e.g. `src/features/player/contracts.ts`) and import utilities from `@lib/contracts`.

---

Extend this README with additional patterns (async validation, nested specs, etc.) as they emerge.

