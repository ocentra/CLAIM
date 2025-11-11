import { getLogStorage, type LogQuery } from './logStorage';

export interface QueryParams {
  level?: 'log' | 'error' | 'warn' | 'info' | 'debug';
  source?: 'Auth' | 'Network' | 'Assets' | 'GameEngine' | 'UI' | 'Store' | 'System' | 'Other';
  context?: string;
  since?: string;
  limit?: number;
  tags?: string[];
}

export function parseQueryParams(url: string): QueryParams {
  const urlObj = new URL(url, 'http://localhost');
  const params: QueryParams = {};

  const level = urlObj.searchParams.get('level');
  if (level && ['log', 'error', 'warn', 'info', 'debug'].includes(level)) {
    params.level = level as QueryParams['level'];
  }

  const source = urlObj.searchParams.get('source');
  if (source && ['Auth', 'Network', 'Assets', 'GameEngine', 'UI', 'Store', 'System', 'Other'].includes(source)) {
    params.source = source as QueryParams['source'];
  }

  const context = urlObj.searchParams.get('context');
  if (context) {
    params.context = context;
  }

  const since = urlObj.searchParams.get('since');
  if (since) {
    params.since = parseSinceParam(since);
  }

  const limit = urlObj.searchParams.get('limit');
  if (limit) {
    const limitNum = parseInt(limit, 10);
    if (!Number.isNaN(limitNum) && limitNum > 0 && limitNum <= 10000) {
      params.limit = limitNum;
    }
  }

  const tags = urlObj.searchParams.get('tags');
  if (tags) {
    params.tags = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
  }

  return params;
}

function parseSinceParam(since: string): string {
  const relativeMatch = since.match(/^(\d+)([hdms])$/);
  if (relativeMatch) {
    const value = parseInt(relativeMatch[1], 10);
    const unit = relativeMatch[2];

    let ms = 0;
    switch (unit) {
      case 's':
        ms = value * 1000;
        break;
      case 'm':
        ms = value * 60 * 1000;
        break;
      case 'h':
        ms = value * 60 * 60 * 1000;
        break;
      case 'd':
        ms = value * 24 * 60 * 60 * 1000;
        break;
      default:
        ms = 0;
    }

    const timestamp = new Date(Date.now() - ms);
    return timestamp.toISOString();
  }

  return since;
}

export async function queryLogsFromParams(params: QueryParams) {
  const storage = getLogStorage();

  const query: LogQuery = {
    level: params.level,
    source: params.source,
    context: params.context,
    since: params.since,
    limit: params.limit ?? 1000,
  };

  let logs = await storage.queryLogs(query);

  if (params.tags && params.tags.length > 0) {
    logs = logs.filter(log => {
      const logTags = extractTagsFromLog(log);
      return params.tags!.some(tag => logTags.includes(tag));
    });
  }

  return logs;
}

export async function getLogStatsFromParams() {
  const storage = getLogStorage();
  return storage.getLogStats();
}

function extractTagsFromLog(log: { context: string; message: string }): string[] {
  const tags: string[] = [];

  const contextMatch = log.context.match(/LOG_\w+/g);
  if (contextMatch) {
    tags.push(...contextMatch);
  }

  const messageMatch = log.message.match(/LOG_\w+/g);
  if (messageMatch) {
    tags.push(...messageMatch);
  }

  return [...new Set(tags)];
}


