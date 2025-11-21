# Logging Library

**Purpose:** Unified logging system with IndexedDB persistence, query utilities, and integration with EventBus and other packages.

**Location:** `src/lib/logging/logger.ts`

**Full Documentation:** `src/lib/logging/README.md` (detailed usage guide)

---

## What It Does

Logging library provides:
- **Module-based logging:** Organize logs by module (UI, GAME_ENGINE, AI, etc.)
- **IndexedDB persistence:** Store logs in browser IndexedDB
- **Query utilities:** Query logs by time, level, source, etc.
- **Integration:** Works with EventBus and other packages

**Key Use Case:** Structured logging with persistence for debugging and monitoring.

---

## Quick Start

### Simple Module Logging

```typescript
import { logInfo, logWarn, logError } from '@lib/logging'

logInfo('GAME_ENGINE', 'Deck initialised', { cards: 52 })
logWarn('UI', 'Slow render detected', componentName)
logError('NETWORK', 'Failed to connect', error)
```

### Creating a Prefixed Logger

```typescript
import { createModuleLogger } from '@lib/logging'

const logger = createModuleLogger('ASSETS', { prefix: '[TextureLoader]' })

logger.logInfo('Loaded texture', { id: textureId })
logger.logWarning('Fallback to low-res asset')
logger.logError('Failed to decode texture', error)
```

### Querying Logs

```typescript
import { queryLogs } from '@lib/logging/logQuery'

const result = await queryLogs({
  since: '1h',
  level: 'error',
  source: 'Network',
  limit: 20,
})

console.table(result.logs)
```

---

## Key Features

### 1. Module Flags

```typescript
export const LOG_FLAGS = {
  UI: false,
  GAME_ENGINE: false,
  AI: false,
  NETWORK: false,
  ASSETS: false,
  STORE: false,
}
```

Set flag to `true` to enable console output for that module.

### 2. Log Levels

```typescript
logInfo(module, message, ...args)     // Info level
logWarn(module, message, ...args)     // Warning level
logError(module, message, ...args)    // Error level
```

### 3. Auth-Specific Logging

```typescript
import { logAuth } from '@lib/logging'

const LOG_AUTH_FLOW = true

await logAuth(LOG_AUTH_FLOW, 'info', '[AuthProvider]', 'User signed in', userId)
```

### 4. Storage Access

```typescript
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

---

## Common Patterns

### Pattern 1: EventBus Integration

```typescript
import { createEventLogger } from '@lib/eventing'

const logger = createEventLogger('GAME_ENGINE', '[CardDeck]')
logger.logInfo('Deck initialised')
```

### Pattern 2: Error Logging

```typescript
try {
  await riskyOperation()
} catch (error) {
  logError('GAME_ENGINE', 'Operation failed', error)
  throw error
}
```

### Pattern 3: Performance Logging

```typescript
const startTime = performance.now()
// ... operation
const duration = performance.now() - startTime
logInfo('UI', 'Render time', { component: 'GameScreen', duration })
```

---

## API Reference

| API | Purpose |
|-----|---------|
| `logInfo(module, message, ...args)` | Log info message |
| `logWarn(module, message, ...args)` | Log warning message |
| `logError(module, message, ...args)` | Log error message |
| `logAuth(enabled, level, prefix, message, ...args)` | Auth-specific logging |
| `createModuleLogger(module, options?)` | Create prefixed logger |
| `getLogStorage()` | Get IndexedDB storage instance |
| `queryLogs(options)` | Query stored logs |

---

## When to Use

✅ **Use Logging when:**
- Need structured logging
- Need persistent log storage
- Need to query logs (debugging, monitoring)
- Integrating with EventBus or other systems

❌ **Don't use Logging when:**
- Simple console.log is sufficient
- Don't need persistence
- Performance-critical code (use console directly)

---

## Related Docs

- [eventbus.md](./eventbus.md) - EventBus (integrated with logging)
- `src/lib/logging/README.md` - Full documentation with examples

---

**Last Updated:** 2025-01-20  
**Full Documentation:** `src/lib/logging/README.md`

