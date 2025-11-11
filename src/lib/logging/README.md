# Logging Library

`@lib/logging` provides a unified logging system with optional IndexedDB persistence, BroadcastChannel/WS bridging, query utilities, and integration points for other packages (e.g. `@lib/eventing`). This document explains the pieces available and how to use them effectively.

---

## 1. Overview

| Component        | Purpose                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------- |
| `logger.ts`      | Central logging API (`logInfo`, `logError`, flags, auth helper).                        |
| `logStorage.ts`  | IndexedDB-backed storage; responsible for persisting and querying log records.          |
| `logBridge.ts`   | Browser WebSocket bridge for MCP tooling; coordinates leader tab via BroadcastChannel.  |
| `logApi.ts`      | Server-side utilities for exposing logs through HTTP (used by Vite middleware).         |
| `logRouteHandler.ts` | Express-style handler helpers for log querying endpoints.                           |
| `logQuery.ts`    | Client-side helper to fetch stored logs via API.                                        |

You can use the console-only helpers if you don’t need persistence. When `logStorage` is available, every log entry is also persisted asynchronously in IndexedDB and accessible to tools or other parts of the app.

---

## 2. Writing Logs

### 2.1 Simple module logging

```ts
import { logInfo, logWarn, logError } from '@lib/logging'

logInfo('GAME_ENGINE', 'Deck initialised', { cards: 52 })
logWarn('UI', 'Slow render detected', componentName)
logError('NETWORK', 'Failed to connect', error)
```

- The first argument is a module key defined in `LOG_FLAGS`.
- If the flag for the module is `true`, the message is echoed to the console.
- Regardless of the flag, the entry is stored (if storage is available).

### 2.2 Creating a prefixed logger

For repeated logging within a subsystem, use `createModuleLogger`.

```ts
import { createModuleLogger } from '@lib/logging'

const logger = createModuleLogger('ASSETS', { prefix: '[TextureLoader]' })

logger.logInfo('Loaded texture', { id: textureId })
logger.logWarning('Fallback to low-res asset')
logger.logError('Failed to decode texture', error)
```

This keeps format consistent and avoids repeating the module/prefix every time.

### 2.3 Auth-specific logging

`logAuth` accepts a runtime flag per call, allowing granular console control while still persisting records.

```ts
import { logAuth } from '@lib/logging'

const LOG_AUTH_FLOW = true

await logAuth(LOG_AUTH_FLOW, 'info', '[AuthProvider]', 'User signed in', userId)
```

---

## 3. Storing Logs

`logger.ts` automatically persists entries to IndexedDB via `logStorage`.  
Fetching the storage is asynchronous and graceful if unsupported.

```ts
import { getLogStorage } from '@lib/logging'

const storage = await getLogStorage()
await storage.storeLog({
  level: 'info',
  source: 'Custom',
  context: 'loadProfile',
  message: 'Profile loaded',
  args: [{ profileId }],
  timestamp: Date.now(),
})
```

`storeLog` is the low-level API used internally by the logger; most callers won’t interact with it directly.

---

## 4. Querying Logs

### 4.1 In-browser query helper

```ts
import { queryLogs } from '@lib/logging/logQuery'

const result = await queryLogs({
  since: '1h',
  level: 'error',
  source: 'Network',
  limit: 20,
})

console.table(result.logs)
```

`queryLogs` talks to the same HTTP endpoints exposed by the log API helper.

### 4.2 Server route helper

If you need a backend endpoint:

```ts
import express from 'express'
import { createLogRouteHandler } from '@lib/logging/logRouteHandler'

const router = express.Router()
router.get('/logs', createLogRouteHandler())
```

The handler parses query parameters, pulls logs from storage, and responds in JSON.

---

## 5. MCP / DevTools Bridge

`logBridge.ts` coordinates multiple browser tabs and forwards log entries via WebSocket to a Node.js peer—useful for external tooling (e.g. model control plane).

Key features:
- Leader election via `BroadcastChannel`.
- Automatic reconnect with backoff.
- Ping/pong health checks.

You can enable verbose bridge logging by flipping `LOG_MCP_BRIDGE` at the top of the file.

---

## 6. Configuration

Flags are defined in `logger.ts`:

```ts
export const LOG_FLAGS = {
  UI: false,
  GAME_ENGINE: false,
  AI: false,
  NETWORK: false,
  ASSETS: false,
  STORE: false,
}
```

Set any flag to `true` to mirror logs to the console in addition to persistent storage.

Global toggle `LOG_ENABLED` governs whether warnings about storage failures appear in console.

---

## 7. Integration with Other Packages

- **Eventing** uses `createEventLogger` (implemented on top of `createModuleLogger`) to emit bus diagnostics.
- **React behaviours / features** can create their own scoped loggers without reimplementing persistence.
- **Auth flows** rely on `logAuth` to tag entries appropriately (level + `auth` tags).

---

## 8. Tips

- **Batching** – If you’re logging in tight loops, consider throttling to avoid overwhelming IndexedDB.
- **Tags** – Provide extra context (e.g., `['error', 'critical']`) so queries can filter more precisely.
- **Time filters** – `queryLogs` accepts relative durations like `'30m'`, `'24h'`, or absolute ISO strings.
- **Storage errors** – All storage operations are fail-safe; they won’t throw to calling code. For debugging, temporarily enable `LOG_ENABLED`.

---

Need to add a new module? Extend `LOG_FLAGS` and optionally map it to a `LogSource` in `logStorage.ts`. Contributions welcome—update this README with new workflows as they arise.

