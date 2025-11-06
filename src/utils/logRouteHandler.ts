/**
 * Log Route Handler
 * 
 * Parses request query parameters and queries IndexedDB.
 * Returns results in JSON format.
 */

import { getLogStorage, type LogQuery } from './logStorage';

export interface QueryParams {
  level?: 'log' | 'error' | 'warn' | 'info' | 'debug';
  source?: 'Auth' | 'Network' | 'Assets' | 'GameEngine' | 'UI' | 'Store' | 'System' | 'Other';
  context?: string; // Partial match
  since?: string; // RFC3339 timestamp or relative (e.g., "1h", "24h", "7d")
  limit?: number; // Max results (1-10000, default: 1000)
  tags?: string[]; // Filter by tags/flags (comma-separated)
}

/**
 * Parse query parameters from URL
 */
export function parseQueryParams(url: string): QueryParams {
  const urlObj = new URL(url, 'http://localhost');
  const params: QueryParams = {};
  
  // Parse level
  const level = urlObj.searchParams.get('level');
  if (level && ['log', 'error', 'warn', 'info', 'debug'].includes(level)) {
    params.level = level as QueryParams['level'];
  }
  
  // Parse source
  const source = urlObj.searchParams.get('source');
  if (source && ['Auth', 'Network', 'Assets', 'GameEngine', 'UI', 'Store', 'System', 'Other'].includes(source)) {
    params.source = source as QueryParams['source'];
  }
  
  // Parse context (partial match)
  const context = urlObj.searchParams.get('context');
  if (context) {
    params.context = context;
  }
  
  // Parse since (timestamp or relative)
  const since = urlObj.searchParams.get('since');
  if (since) {
    params.since = parseSinceParam(since);
  }
  
  // Parse limit
  const limit = urlObj.searchParams.get('limit');
  if (limit) {
    const limitNum = parseInt(limit, 10);
    if (!isNaN(limitNum) && limitNum > 0 && limitNum <= 10000) {
      params.limit = limitNum;
    }
  }
  
  // Parse tags (comma-separated)
  const tags = urlObj.searchParams.get('tags');
  if (tags) {
    params.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
  }
  
  return params;
}

/**
 * Parse "since" parameter - supports RFC3339 timestamps or relative times
 * Examples: "2025-01-01T00:00:00Z", "1h", "24h", "7d"
 */
function parseSinceParam(since: string): string {
  // Check if it's a relative time (e.g., "1h", "24h", "7d")
  const relativeMatch = since.match(/^(\d+)([hdms])$/);
  if (relativeMatch) {
    const value = parseInt(relativeMatch[1], 10);
    const unit = relativeMatch[2];
    
    let ms = 0;
    switch (unit) {
      case 's': ms = value * 1000; break;
      case 'm': ms = value * 60 * 1000; break;
      case 'h': ms = value * 60 * 60 * 1000; break;
      case 'd': ms = value * 24 * 60 * 60 * 1000; break;
    }
    
    const timestamp = new Date(Date.now() - ms);
    return timestamp.toISOString();
  }
  
  // Otherwise, assume it's already an RFC3339 timestamp
  return since;
}

/**
 * Query logs based on parsed parameters
 */
export async function queryLogsFromParams(params: QueryParams) {
  const storage = getLogStorage();
  
  const query: LogQuery = {
    level: params.level,
    source: params.source,
    context: params.context,
    since: params.since,
    limit: params.limit || 1000,
  };
  
  let logs = await storage.queryLogs(query);
  
  // Filter by tags if provided
  if (params.tags && params.tags.length > 0) {
    logs = logs.filter(log => {
      const logTags = extractTagsFromLog(log);
      return params.tags!.some(tag => logTags.includes(tag));
    });
  }
  
  return logs;
}

/**
 * Get log statistics
 */
export async function getLogStatsFromParams() {
  const storage = getLogStorage();
  return await storage.getLogStats();
}

/**
 * Extract tags from log entry
 */
function extractTagsFromLog(log: { context: string; message: string }): string[] {
  const tags: string[] = [];
  
  // Extract tags from context (e.g., "LOG_AUTH_FLOW" patterns)
  const contextMatch = log.context.match(/LOG_\w+/g);
  if (contextMatch) {
    tags.push(...contextMatch);
  }
  
  // Extract tags from message
  const messageMatch = log.message.match(/LOG_\w+/g);
  if (messageMatch) {
    tags.push(...messageMatch);
  }
  
  return [...new Set(tags)]; // Remove duplicates
}

