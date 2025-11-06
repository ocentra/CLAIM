/**
 * Log Query Interface
 * 
 * Provides a simple interface for querying logs from IndexedDB.
 * This is the interface that AI assistants can use to read logs.
 */

import { getLogStorage, type LogEntry, type LogQuery, type LogStats } from './logStorage';

/**
 * Query logs from IndexedDB
 * 
 * @param query - Query parameters (level, context, source, since, limit)
 * @returns Array of log entries matching the query
 * 
 * @example
 * // Get all error logs from the last hour
 * const errors = await queryLogs({
 *   level: 'error',
 *   since: new Date(Date.now() - 3600000).toISOString(),
 *   limit: 100
 * });
 * 
 * @example
 * // Get all auth-related logs
 * const authLogs = await queryLogs({
 *   source: 'Auth',
 *   limit: 50
 * });
 */
export async function queryLogs(query: LogQuery = {}): Promise<LogEntry[]> {
  const storage = getLogStorage();
  return await storage.queryLogs(query);
}

/**
 * Get log statistics
 * 
 * @returns Statistics about stored logs (counts by level, source, context, etc.)
 * 
 * @example
 * const stats = await getLogStats();
 * console.log(`Total logs: ${stats.total_logs}`);
 * console.log(`Errors: ${stats.by_level.error}`);
 */
export async function getLogStats(): Promise<LogStats> {
  const storage = getLogStorage();
  return await storage.getLogStats();
}

/**
 * Clear logs (optionally filtered)
 * 
 * @param query - Optional query to filter which logs to clear
 * @returns Number of logs deleted
 * 
 * @example
 * // Clear all logs
 * await clearLogs();
 * 
 * @example
 * // Clear only error logs older than 7 days
 * await clearLogs({
 *   level: 'error',
 *   since: new Date(Date.now() - 7 * 24 * 3600000).toISOString()
 * });
 */
export async function clearLogs(query?: LogQuery): Promise<number> {
  const storage = getLogStorage();
  return await storage.clearLogs(query);
}

/**
 * Get recent logs (convenience function)
 * 
 * @param limit - Maximum number of logs to return (default: 100)
 * @returns Array of recent log entries
 */
export async function getRecentLogs(limit: number = 100): Promise<LogEntry[]> {
  return await queryLogs({ limit });
}

/**
 * Get error logs (convenience function)
 * 
 * @param limit - Maximum number of logs to return (default: 100)
 * @param since - Optional timestamp to filter logs since
 * @returns Array of error log entries
 */
export async function getErrorLogs(limit: number = 100, since?: string): Promise<LogEntry[]> {
  return await queryLogs({ level: 'error', limit, since });
}

/**
 * Get logs by source (convenience function)
 * 
 * @param source - Log source to filter by
 * @param limit - Maximum number of logs to return (default: 100)
 * @returns Array of log entries from the specified source
 */
export async function getLogsBySource(
  source: 'Auth' | 'Network' | 'Assets' | 'GameEngine' | 'UI' | 'Store' | 'System' | 'Other',
  limit: number = 100
): Promise<LogEntry[]> {
  return await queryLogs({ source, limit });
}

/**
 * Get logs by context (convenience function)
 * 
 * @param context - Context/module name to filter by (partial match)
 * @param limit - Maximum number of logs to return (default: 100)
 * @returns Array of log entries from the specified context
 */
export async function getLogsByContext(context: string, limit: number = 100): Promise<LogEntry[]> {
  return await queryLogs({ context, limit });
}

