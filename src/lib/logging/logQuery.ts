import { getLogStorage, type LogEntry, type LogQuery, type LogStats } from './logStorage';

export async function queryLogs(query: LogQuery = {}): Promise<LogEntry[]> {
  const storage = getLogStorage();
  return storage.queryLogs(query);
}

export async function getLogStats(): Promise<LogStats> {
  const storage = getLogStorage();
  return storage.getLogStats();
}

export async function clearLogs(query?: LogQuery): Promise<number> {
  const storage = getLogStorage();
  return storage.clearLogs(query);
}

export async function getRecentLogs(limit = 100): Promise<LogEntry[]> {
  return queryLogs({ limit });
}

export async function getErrorLogs(limit = 100, since?: string): Promise<LogEntry[]> {
  return queryLogs({ level: 'error', limit, since });
}

export async function getLogsBySource(
  source: 'Auth' | 'Network' | 'Assets' | 'GameEngine' | 'UI' | 'Store' | 'System' | 'Other',
  limit = 100
): Promise<LogEntry[]> {
  return queryLogs({ source, limit });
}

export async function getLogsByContext(context: string, limit = 100): Promise<LogEntry[]> {
  return queryLogs({ context, limit });
}


