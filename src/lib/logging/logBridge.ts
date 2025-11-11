/**
 * Log Bridge - Browser-side WebSocket bridge for MCP tools
 *
 * Uses BroadcastChannel for tab coordination to elect a single leader tab.
 * Only the leader tab opens WebSocket connection to Node.js server.
 *
 * Architecture:
 * - Multiple tabs can be open
 * - Only one tab is "leader" (handles MCP commands)
 * - Auto-election if leader closes
 * - Auto-reconnect on disconnect
 */

import { getLogStorage, type LogQuery } from './logStorage';

const LOG_MCP_BRIDGE = false;
const channel = new BroadcastChannel('mcp_bridge');

const tabId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
let isLeader = false;
let ws: WebSocket | null = null;
let wsState: 'disconnected' | 'connecting' | 'connected' = 'disconnected';
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let pingInterval: ReturnType<typeof setInterval> | null = null;

function becomeLeader(): void {
  if (isLeader) return;
  isLeader = true;
  if (LOG_MCP_BRIDGE) console.log('[LogBridge] This tab is now leader', tabId);
  connectWS();
}

function resignLeadership(): void {
  if (!isLeader) return;
  isLeader = false;
  if (LOG_MCP_BRIDGE) console.log('[LogBridge] Lost leadership');
  if (ws) {
    ws.close();
    ws = null;
  }
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
  wsState = 'disconnected';
}

function connectWS(): void {
  if (!isLeader) return;
  if (wsState === 'connecting' || wsState === 'connected') return;

  wsState = 'connecting';

  try {
    const port = window.location.port || '3000';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:${port}/ws`;

    if (LOG_MCP_BRIDGE) console.log('[LogBridge] Connecting to', wsUrl);
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      if (!ws || ws.readyState !== WebSocket.OPEN || !isLeader) {
        return;
      }

      wsState = 'connected';
      if (LOG_MCP_BRIDGE) console.log('[LogBridge] Connected to Node.js server');

      startHeartbeat();

      try {
        channel.postMessage({ type: 'leader-connected', tabId });
      } catch {
        // ignore
      }
    };

    ws.onmessage = async event => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        return;
      }

      try {
        const msg = JSON.parse(event.data);
        await handleMessage(msg);
      } catch (error) {
        if (LOG_MCP_BRIDGE) console.error('[LogBridge] Error handling message:', error);
      }
    };

    ws.onerror = error => {
      if (LOG_MCP_BRIDGE) console.error('[LogBridge] WebSocket error:', error);
    };

    ws.onclose = () => {
      wsState = 'disconnected';
      if (LOG_MCP_BRIDGE) console.log('[LogBridge] Disconnected from Node.js server');

      ws = null;

      stopHeartbeat();

      if (isLeader) {
        if (LOG_MCP_BRIDGE) console.log('[LogBridge] Reconnecting in 2s...');
        reconnectTimeout = setTimeout(() => {
          if (isLeader && wsState === 'disconnected') {
            connectWS();
          }
        }, 2000);
      }
    };
  } catch (error) {
    if (LOG_MCP_BRIDGE) console.error('[LogBridge] Failed to connect:', error);
    wsState = 'disconnected';

    if (isLeader) {
      reconnectTimeout = setTimeout(() => {
        if (isLeader) {
          connectWS();
        }
      }, 2000);
    }
  }
}

function startHeartbeat(): void {
  if (pingInterval) return;

  pingInterval = setInterval(() => {
    if (ws && wsState === 'connected' && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ type: 'ping' }));
      } catch (error) {
        if (LOG_MCP_BRIDGE) console.error('[LogBridge] Heartbeat error:', error);
        stopHeartbeat();
        wsState = 'disconnected';
      }
    } else {
      stopHeartbeat();
    }
  }, 30000);
}

function stopHeartbeat(): void {
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
}

async function handleMessage(msg: { type: string; id?: string; params?: unknown }): Promise<void> {
  if (msg.type === 'pong') {
    return;
  }

  if (!msg.id) {
    if (LOG_MCP_BRIDGE) console.warn('[LogBridge] Message without ID:', msg);
    return;
  }

  try {
    let result: unknown;

    if (msg.type === 'query_logs') {
      const params = msg.params as LogQuery;
      const storage = getLogStorage();
      result = await storage.queryLogs(params);
    } else if (msg.type === 'get_log_stats') {
      const params = msg.params as { since?: string } | undefined;
      const storage = getLogStorage();
      if (params?.since) {
        const logs = await storage.queryLogs({ since: params.since, limit: 10000 });
        const stats = {
          total_logs: logs.length,
          by_level: {} as Record<string, number>,
          by_source: {} as Record<string, number>,
          by_context: {} as Record<string, number>,
          oldest_timestamp: logs.length > 0 ? Math.min(...logs.map(l => l.timestamp)) : null,
          newest_timestamp: logs.length > 0 ? Math.max(...logs.map(l => l.timestamp)) : null,
        };
        for (const log of logs) {
          stats.by_level[log.level] = (stats.by_level[log.level] || 0) + 1;
          stats.by_source[log.source] = (stats.by_source[log.source] || 0) + 1;
          stats.by_context[log.context] = (stats.by_context[log.context] || 0) + 1;
        }
        result = stats;
      } else {
        result = await storage.getLogStats();
      }
    } else if (msg.type === 'clear_logs') {
      const params = msg.params as LogQuery | undefined;
      const storage = getLogStorage();
      result = await storage.clearLogs(params);
    } else {
      throw new Error(`Unknown message type: ${msg.type}`);
    }

    if (ws && wsState === 'connected' && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(
          JSON.stringify({
            type: `${msg.type}_response`,
            id: msg.id,
            result,
          })
        );
      } catch (error) {
        if (LOG_MCP_BRIDGE) console.error('[LogBridge] Failed to send response:', error);
      }
    }
  } catch (error) {
    if (ws && wsState === 'connected' && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(
          JSON.stringify({
            type: `${msg.type}_response`,
            id: msg.id,
            error: error instanceof Error ? error.message : String(error),
          })
        );
      } catch (sendError) {
        if (LOG_MCP_BRIDGE) console.error('[LogBridge] Failed to send error response:', sendError);
      }
    }
  }
}

channel.onmessage = event => {
  const msg = event.data;

  if (msg.type === 'new-tab') {
    if (isLeader) {
      channel.postMessage({ type: 'leader-exists', tabId });
    }
  } else if (msg.type === 'leader-exists') {
    if (LOG_MCP_BRIDGE) console.log('[LogBridge] Leader exists, staying follower');
  } else if (msg.type === 'leader-dead' || msg.type === 'leader-disconnected') {
    if (!isLeader) {
      if (LOG_MCP_BRIDGE) console.log('[LogBridge] Leader gone, attempting election...');
      setTimeout(() => {
        if (!isLeader) {
          becomeLeader();
        }
      }, 100);
    }
  } else if (msg.type === 'leader-connected') {
    if (isLeader && msg.tabId !== tabId) {
      resignLeadership();
    }
  }
};

function startElection(): void {
  channel.postMessage({ type: 'new-tab', tabId });

  setTimeout(() => {
    if (!isLeader) {
      if (LOG_MCP_BRIDGE) console.log('[LogBridge] No leader found, self-electing');
      becomeLeader();
    }
  }, 300);
}

export function initLogBridge(): void {
  if (typeof window === 'undefined') return;

  if (LOG_MCP_BRIDGE) console.log('[LogBridge] Initializing...', tabId);

  startElection();

  window.addEventListener('beforeunload', () => {
    if (isLeader) {
      channel.postMessage({ type: 'leader-dead', tabId });
    }
    channel.close();
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && isLeader && wsState === 'disconnected') {
      connectWS();
    }
  });
}

export function getBridgeStatus(): {
  isLeader: boolean;
  wsState: typeof wsState;
  tabId: string;
} {
  return {
    isLeader,
    wsState,
    tabId,
  };
}


