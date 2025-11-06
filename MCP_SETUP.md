# MCP Server Setup for Claim App Logs

This project includes an MCP (Model Context Protocol) server that allows AI assistants (like Cursor, Claude Desktop) to query application logs directly.

## Architecture

```
Browser (IndexedDB) → Log Export → HTTP API → JSON File → MCP Server → AI Assistant
```

1. **Browser**: Logs are stored in IndexedDB via `logStorage.ts`
2. **Log Export**: `logExport.ts` periodically exports logs to an HTTP endpoint
3. **Log API Server**: `log-api-server.ts` receives logs and writes to `logs.json`
4. **MCP Server**: `mcp-server.ts` reads from `logs.json` and provides MCP tools
5. **AI Assistant**: Can query logs via MCP tools

## Setup

### 1. Install Dependencies

Already installed: `@modelcontextprotocol/sdk`

### 2. Start Development Server

The dev server automatically starts the log API server:

```bash
npm run dev
```

This will:
- Start Vite dev server on port 3000
- Start log API server on port 3001
- Auto-export logs from browser every 5 seconds

### 3. Configure Cursor IDE

The MCP configuration is already set up in `.cursor/mcp.json`. Cursor should automatically detect it.

If you need to configure manually:

1. Open Cursor Settings
2. Go to MCP Servers
3. Add:
   - Name: `claim-logs`
   - Command: `npm run mcp:server`
   - Working Directory: Project root

### 4. Configure Claude Desktop

Add to `~/.claude/mcp.json` (or `%APPDATA%\Claude\mcp.json` on Windows):

```json
{
  "mcpServers": {
    "claim-logs": {
      "command": "npm",
      "args": ["run", "mcp:server"],
      "cwd": "E:\\Claim"
    }
  }
}
```

## Available MCP Tools

### 1. `query_logs`

Query logs with filters:

```typescript
{
  level?: 'log' | 'error' | 'warn' | 'info' | 'debug',
  source?: 'Auth' | 'Network' | 'Assets' | 'GameEngine' | 'UI' | 'Store' | 'System' | 'Other',
  context?: string,  // Partial match
  since?: string,    // RFC3339 timestamp
  limit?: number     // 1-10000, default: 1000
}
```

**Example:**
```json
{
  "level": "error",
  "source": "Auth",
  "since": "2025-10-31T10:00:00Z",
  "limit": 50
}
```

### 2. `get_log_stats`

Get statistics about stored logs:

- Total log count
- Counts by level (log, error, warn, info, debug)
- Counts by source (Auth, Network, etc.)
- Counts by context/module
- Oldest and newest timestamps

### 3. `clear_logs`

Clear logs (optionally filtered):

```typescript
{
  level?: 'log' | 'error' | 'warn' | 'info' | 'debug',
  source?: 'Auth' | 'Network' | 'Assets' | 'GameEngine' | 'UI' | 'Store' | 'System' | 'Other',
  since?: string  // Clear logs older than this
}
```

## Usage Examples

### For AI Assistants

Instead of asking the user to copy/paste console logs, you can now query them directly:

**Example 1: Check recent auth errors**
```
Use the query_logs tool with:
- level: "error"
- source: "Auth"
- limit: 50
```

**Example 2: Get all auth flow logs**
```
Use the query_logs tool with:
- source: "Auth"
- limit: 200
```

**Example 3: Get log statistics**
```
Use the get_log_stats tool to see:
- Total logs
- Error count
- Auth log count
- etc.
```

## Manual Testing

### Test MCP Server Directly

```bash
npm run mcp:server
```

The server uses stdio transport, so it expects input via stdin.

### Test Log API Server

```bash
npm run mcp:log-api
```

Then in browser console:
```javascript
// Export logs manually
import { exportLogsToFile } from './utils/logExport';
await exportLogsToFile();
```

## Troubleshooting

### MCP Server Not Working

1. Check that `logs.json` exists in project root
2. Verify log API server is running (port 3001)
3. Check browser console for export errors
4. Ensure MCP configuration is correct

### Logs Not Appearing

1. Check browser console - logs should be stored in IndexedDB
2. Verify auto-export is running (check network tab for POST to localhost:3001)
3. Check `logs.json` file exists and has content
4. Verify log API server is running

### Port Conflicts

If port 3001 is in use:
- Change `PORT` in `scripts/log-api-server.ts`
- Update fetch URL in `src/utils/logExport.ts`

## Files

- `src/utils/logStorage.ts` - IndexedDB log storage
- `src/utils/logExport.ts` - Log export to HTTP API
- `scripts/log-api-server.ts` - HTTP server that receives logs
- `scripts/mcp-server.ts` - MCP server that provides tools
- `.cursor/mcp.json` - Cursor IDE MCP configuration
- `logs.json` - Log file (created automatically)

