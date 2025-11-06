# Log Query Interface

This system provides persistent IndexedDB storage for application logs, similar to the Rust MCP pattern. All logs are automatically stored in IndexedDB, and you can query them directly.

## Usage

### Query Logs

```typescript
import { queryLogs, getErrorLogs, getLogsBySource } from '@/utils/logQuery';

// Get all error logs from the last hour
const errors = await queryLogs({
  level: 'error',
  since: new Date(Date.now() - 3600000).toISOString(),
  limit: 100
});

// Get all auth-related logs
const authLogs = await getLogsBySource('Auth', 50);

// Get logs by context
const firebaseLogs = await getLogsByContext('FirebaseService', 100);
```

### Get Statistics

```typescript
import { getLogStats } from '@/utils/logQuery';

const stats = await getLogStats();
console.log(`Total logs: ${stats.total_logs}`);
console.log(`Errors: ${stats.by_level.error}`);
console.log(`Auth logs: ${stats.by_source.Auth}`);
```

### Clear Logs

```typescript
import { clearLogs } from '@/utils/logQuery';

// Clear all logs
await clearLogs();

// Clear only error logs older than 7 days
await clearLogs({
  level: 'error',
  since: new Date(Date.now() - 7 * 24 * 3600000).toISOString()
});
```

## Query Parameters

- `level`: Filter by log level (`'log' | 'error' | 'warn' | 'info' | 'debug'`)
- `source`: Filter by source (`'Auth' | 'Network' | 'Assets' | 'GameEngine' | 'UI' | 'Store' | 'System' | 'Other'`)
- `context`: Filter by context/module name (partial match, case-insensitive)
- `since`: RFC3339 timestamp (e.g., `"2025-10-31T10:00:00Z"`)
- `limit`: Maximum number of results (1-10000, default: 1000)

## How It Works

1. **Automatic Storage**: All logs are automatically stored in IndexedDB when logged
2. **Console Logging**: Console logging is controlled by flags (e.g., `LOG_AUTH_FLOW`)
3. **Persistent Storage**: Logs persist across page reloads
4. **Query Interface**: Use the query functions to read logs programmatically

## For AI Assistants

You can now query logs directly instead of asking the user to copy/paste console logs:

```typescript
// Example: Check recent auth errors
const recentErrors = await getErrorLogs(50);
const authErrors = recentErrors.filter(log => log.source === 'Auth');

// Example: Get auth flow logs
const authLogs = await getLogsBySource('Auth', 200);
```

