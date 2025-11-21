/**
 * Logs Query Page
 * 
 * Handles /api/logs/query route - queries IndexedDB and displays JSON
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  parseQueryParams,
  queryLogsFromParams,
  getLogStatsFromParams,
} from '@lib/logging/logRouteHandler';
import './LogsQueryPage.css';

export function LogsQueryPage() {
  const location = useLocation();
  const [data, setData] = useState<{ success: boolean; count?: number; logs?: unknown[]; stats?: unknown } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        if (location.pathname === '/api/logs/stats') {
          // Get statistics
          const stats = await getLogStatsFromParams();
          setData({ success: true, stats });
        } else {
          // Query logs
          const url = window.location.href;
          const params = parseQueryParams(url);
          
          // Debug: log what we're querying
          console.log('[LogsQueryPage] Query params:', params);
          
          const logs = await queryLogsFromParams(params);
          
          // Debug: log results
          console.log('[LogsQueryPage] Found logs:', logs.length);
          
          setData({ success: true, count: logs.length, logs });
        }
        
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [location]);

  if (loading) {
    return (
      <div className="logs-query-loading">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="logs-query-error">
        <h1 className="logs-query-error-title">Error</h1>
        <pre className="logs-query-pre">{JSON.stringify({ error }, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="logs-query-container">
      <h1 className="logs-query-title">Logs API Response</h1>
      <pre className="logs-query-pre">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

