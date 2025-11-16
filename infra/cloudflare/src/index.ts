export interface Env {
  MATCHES_BUCKET: R2Bucket;
  ENVIRONMENT: string;
  BUCKET_NAME?: string;  // Bucket name for safety checks (claim-matches-test in dev, claim-matches in prod)
  CORS_ORIGIN?: string;  // Allowed CORS origin (required in production, can be * in dev)
  CORS_ALLOWED_ORIGINS?: string;  // Comma-separated list of allowed origins (for dev whitelist)
  COORDINATOR_PUBLIC_KEY?: string;  // Coordinator public key for signature verification
  RATE_LIMIT_KV?: KVNamespace;  // KV namespace for rate limiting
  RATE_LIMIT_MATCHES_PER_HOUR?: string;  // Rate limit for match uploads per hour (default: 100 prod, 10 dev)
  AI_SERVICE_URL?: string;  // Optional external AI service URL
  AI_API_KEY?: string;  // Optional API key for AI service
  MATCH_COORDINATOR: DurableObjectNamespace;  // Durable Object for match coordination
  SIGNED_URL_SECRET?: string;  // Secret key for HMAC signing of signed URLs
  // Per spec Section 32.2: Alerting infrastructure
  ALERT_WEBHOOK_URL?: string;  // Webhook URL for alerts (Slack, Discord, etc.)
  ALERT_EMAIL?: string;  // Email for critical alerts
  // Per critique Issue #13: Firebase authentication
  FIREBASE_PROJECT_ID?: string;  // Firebase project ID for token verification
}

// Per critique Fix 9: Integrate MetricsCollector for actual metrics emission
import { MetricsCollector } from '@services/monitoring/MetricsCollector';
import { emitMetrics, checkAlertThresholds } from './monitoring';
import { verifyAuth } from './auth';  // Per critique Issue #13: Firebase token verification
import { generateOpenApiJson, generateSwaggerHtml } from './openapi';
import { templates } from './templates/loader';

// Global metrics collector instance
const metricsCollector = new MetricsCollector();

/**
 * Gets CORS headers based on environment configuration.
 * Per critique Issue #12: Reject * in production for security.
 */
/**
 * Validates and returns CORS headers with security best practices.
 * Per critique Issue #12: Enhanced CORS security.
 */
function getCorsHeaders(env: Env, requestOrigin?: string): Record<string, string> {
  const allowedOrigin = env.CORS_ORIGIN || '*';
  const isProduction = env.ENVIRONMENT === 'production';
  
  // Per critique Issue #12: Reject * in production
  if (isProduction && allowedOrigin === '*') {
    throw new Error('CORS_ORIGIN cannot be "*" in production. Set a specific origin.');
  }
  
  // Security: Log suspicious origin attempts in production
  if (isProduction && requestOrigin && requestOrigin !== allowedOrigin) {
    console.warn(`[SECURITY] CORS origin mismatch: ${requestOrigin} attempted access (allowed: ${allowedOrigin})`);
  }
  
  // In production, validate request origin matches allowed origin
  let origin = allowedOrigin;
  if (isProduction && requestOrigin) {
    // Only allow if request origin matches configured origin
    if (requestOrigin !== allowedOrigin) {
      throw new Error(`CORS origin mismatch: ${requestOrigin} not allowed`);
    }
    origin = requestOrigin;
  } else if (!isProduction && allowedOrigin === '*') {
    // Development: allow any origin if configured as *
    // But check whitelist if provided for better security
    if (env.CORS_ALLOWED_ORIGINS && requestOrigin) {
      const allowedOrigins = env.CORS_ALLOWED_ORIGINS.split(',').map(o => o.trim());
      if (allowedOrigins.includes(requestOrigin)) {
        origin = requestOrigin;
      } else {
        console.warn(`[DEV] CORS: Origin ${requestOrigin} not in whitelist, but allowing (dev mode)`);
        origin = requestOrigin;
      }
    } else {
      // No whitelist, allow any origin in dev (with logging)
      if (requestOrigin) {
        console.log(`[DEV] CORS: Allowing origin ${requestOrigin} (development mode - no whitelist)`);
      }
      origin = requestOrigin || '*';
    }
  }
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Signature',
    'Access-Control-Allow-Credentials': 'true', // Only works with specific origin, not *
    'Access-Control-Max-Age': '86400',
    // Security headers
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}

// Export Durable Object class
export { MatchCoordinatorDO } from './durable-objects/MatchCoordinatorDO';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const requestOrigin = request.headers.get('Origin');
    const referer = request.headers.get('Referer');
    
    // Security: Validate Referer header in production (additional CSRF protection)
    if (env.ENVIRONMENT === 'production' && env.CORS_ORIGIN && env.CORS_ORIGIN !== '*') {
      if (referer && !referer.startsWith(env.CORS_ORIGIN)) {
        console.warn(`[SECURITY] Suspicious Referer: ${referer} (expected: ${env.CORS_ORIGIN})`);
        // Don't block, but log for monitoring
      }
    }
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      try {
        return new Response(null, {
          status: 204,
          headers: getCorsHeaders(env, requestOrigin || undefined),
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: 'CORS error', message: error instanceof Error ? error.message : 'Unknown error' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const url = new URL(request.url);
    const path = url.pathname;

    // Root endpoint - show API info and links to docs
    if (path === '/' || path === '') {
      const baseUrl = url.origin;
      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claim Storage API</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: #1a1a1a;
      color: #e0e0e0;
      line-height: 1.6;
    }
    h1 { color: #4a9eff; }
    .endpoint {
      background: #2a2a2a;
      padding: 1rem;
      margin: 1rem 0;
      border-radius: 8px;
      border-left: 3px solid #4a9eff;
    }
    .endpoint code {
      background: #1a1a1a;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      color: #4a9eff;
    }
    a {
      color: #4a9eff;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .status {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      background: #2a7a2a;
      color: #90ee90;
      border-radius: 4px;
      font-size: 0.9rem;
      margin-left: 0.5rem;
    }
  </style>
</head>
<body>
  <h1>🎮 Claim Storage API</h1>
  <p>API for storing and managing game match records, disputes, and AI decisions.</p>
  
  <div class="endpoint">
    <h2>📚 API Documentation</h2>
    <p>
      <a href="${baseUrl}/api/docs" target="_blank">Swagger UI</a> <span class="status">Interactive</span><br>
      <a href="${baseUrl}/openapi.json" target="_blank">OpenAPI JSON</a> <span class="status">Import to Postman</span>
    </p>
  </div>

  <div class="endpoint">
    <h2>🔍 Quick Links</h2>
    <ul>
      <li><a href="${baseUrl}/health">Health Check</a> - <code>GET /health</code></li>
      <li><a href="${baseUrl}/api/metrics">Metrics</a> - <code>GET /api/metrics</code></li>
      <li><a href="${baseUrl}/api/docs">API Docs</a> - <code>GET /api/docs</code></li>
    </ul>
  </div>

  <div class="endpoint">
    <h2>📡 Available Endpoints</h2>
    <ul>
      <li><code>PUT /api/matches/:matchId</code> - Upload match record</li>
      <li><code>GET /api/matches/:matchId</code> - Get match record</li>
      <li><code>DELETE /api/matches/:matchId</code> - Delete match record</li>
      <li><code>GET /api/signed-url/:matchId</code> - Generate signed URL</li>
      <li><code>POST /api/disputes</code> - Create dispute</li>
      <li><code>GET /api/disputes/:disputeId</code> - Get dispute</li>
      <li><code>POST /api/disputes/:disputeId/evidence</code> - Upload evidence</li>
      <li><code>POST /api/archive/:matchId</code> - Archive match</li>
      <li><code>POST /api/ai/on_event</code> - Handle AI event</li>
      <li><code>GET /api/data-export/:userId</code> - Export user data (GDPR)</li>
      <li><code>DELETE /api/data/:userId</code> - Delete user data (GDPR)</li>
      <li><code>POST /api/matches/:matchId/anonymize</code> - Anonymize match (GDPR)</li>
      <li><code>GET /api/leaderboard/:game_type</code> - Get leaderboard (requires indexer)</li>
      <li><code>GET /api/leaderboard/:game_type/user/:user_id</code> - Get user rank (requires indexer)</li>
      <li><code>GET /api/leaderboard/:game_type/tier</code> - Filter by tier (requires indexer)</li>
      <li><code>GET /api/leaderboard/:game_type/nearby/:user_id</code> - Nearby players (requires indexer)</li>
    </ul>
  </div>

  <div class="endpoint" style="border-left-color: #ff6b6b;">
    <h2>🧪 Test Endpoints (Development Only)</h2>
    <p style="color: #ff6b6b; font-weight: bold;">⚠️  WARNING: These endpoints are DANGEROUS and only available in development!</p>
    <ul>
      <li><code>DELETE /api/test/clear-all?confirm=true</code> - Clear ALL records from R2 (IRREVERSIBLE!)</li>
    </ul>
    <p style="color: #ff6b6b; font-size: 0.9rem;">These endpoints are automatically disabled in production.</p>
  </div>

  <div class="endpoint">
    <h2>🌐 Environment</h2>
    <p><strong>Environment:</strong> ${env.ENVIRONMENT || 'development'}</p>
    <p><strong>Base URL:</strong> <code>${baseUrl}</code></p>
  </div>

  <div class="endpoint">
    <h2>📖 Documentation</h2>
    <p>For complete API documentation, validation rules, and examples, see:</p>
    <ul>
      <li><a href="${baseUrl}/api/docs" target="_blank">Interactive Swagger UI</a></li>
      <li><a href="${baseUrl}/openapi.json" target="_blank">OpenAPI 3.0 Specification</a></li>
      <li><a href="${baseUrl}/explore" target="_blank">🎮 Match Explorer</a> - Browse and explore match records</li>
    </ul>
  </div>
</body>
</html>`;
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html',
          ...getCorsHeaders(env),
        },
      });
    }

    // Exploration pages - browse matches, leaderboard, benchmarks
    if (path === '/explore') {
      return new Response(templates.matchExplorer(url.origin), {
        headers: { 'Content-Type': 'text/html', ...getCorsHeaders(env) },
      });
    }
    if (path === '/explore/leaderboard') {
      return new Response(templates.leaderboardExplorer(url.origin), {
        headers: { 'Content-Type': 'text/html', ...getCorsHeaders(env) },
      });
    }
    if (path === '/explore/benchmark') {
      return new Response(templates.benchmarkExplorer(url.origin), {
        headers: { 'Content-Type': 'text/html', ...getCorsHeaders(env) },
      });
    }

    // API endpoints for exploration
    if (path === '/api/explore/matches') {
      return handleListMatches(request, env);
    }
    if (path === '/api/explore/benchmarks') {
      return handleListBenchmarks(request, env);
    }

    // Check for anonymize BEFORE general matches route (order matters!)
    if (path.startsWith('/api/matches/') && path.includes('/anonymize')) {
      return handleAnonymizeRequest(request, env, path);
    }

    if (path.startsWith('/api/matches/')) {
      return handleMatchRequest(request, env, path);
    }

    // Handle /api/disputes (no trailing slash) for POST requests
    if (path === '/api/disputes' && request.method === 'POST') {
      return handleDisputeRequest(request, env, path);
    }

    if (path.startsWith('/api/disputes/')) {
      return handleDisputeRequest(request, env, path);
    }

    if (path.startsWith('/api/signed-url/')) {
      return handleSignedUrlRequest(request, env, path);
    }

    if (path.startsWith('/api/archive/')) {
      return handleArchiveRequest(request, env, path);
    }

    // Per critique Phase 10.3: Privacy/GDPR endpoints
    if (path.startsWith('/api/data-export/')) {
      return handleDataExportRequest(request, env, path);
    }

    if (path.startsWith('/api/data/')) {
      return handleDataDeletionRequest(request, env, path);
    }

    if (path.startsWith('/api/ai/')) {
      // Per critique Issue #13: Verify Firebase token for AI endpoints
      if (env.FIREBASE_PROJECT_ID) {
        const authResult = await verifyAuth(request, env.FIREBASE_PROJECT_ID);
        if (authResult.error || !authResult.userId) {
          return new Response(JSON.stringify({ error: 'Unauthorized', message: authResult.error || 'Authentication required' }), {
            status: 401,
            headers: {
              'Content-Type': 'application/json',
              ...getCorsHeaders(env, requestOrigin || undefined),
            },
          });
        }
      }
      return handleAIRequest(request, env, path);
    }

    // Leaderboard endpoints (per spec Section 20.1.6)
    // Note: These require an off-chain indexer or Solana RPC queries
    // Currently returns placeholder responses - implement with indexer or Solana client
    if (path.startsWith('/api/leaderboard/')) {
      return handleLeaderboardRequest(request, env, path);
    }

    // TEST-ONLY endpoints (development environment only)
    // WARNING: These endpoints are DANGEROUS and should NEVER be enabled in production
    if (path.startsWith('/api/test/')) {
      // Only allow in development environment
      if (env.ENVIRONMENT !== 'development') {
        return new Response(JSON.stringify({ 
          error: 'Forbidden',
          message: 'Test endpoints are only available in development environment'
        }), {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(env),
          },
        });
      }
      return handleTestRequest(request, env, path);
    }

    // OpenAPI/Swagger documentation endpoints
    if (path === '/api/docs' || path === '/docs' || path === '/swagger') {
      const baseUrl = new URL(request.url).origin;
      const html = generateSwaggerHtml(baseUrl);
      return new Response(html, {
        headers: {
          'Content-Type': 'text/html',
          ...getCorsHeaders(env),
        },
      });
    }

    if (path === '/openapi.json' || path === '/api/openapi.json' || path === '/swagger.json') {
      const spec = generateOpenApiJson();
      return new Response(spec, {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    }

    if (path === '/health') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    }

    // Per critique Fix 9: Metrics endpoint
    // Per spec Section 32.1, 32.2: Metrics and alerting
    if (path === '/api/metrics') {
      const metrics = metricsCollector.getMetrics();
      const alerts = checkAlertThresholds(metrics);
      
      // Emit metrics and send alerts asynchronously
      emitMetrics(metrics, env).catch(err => console.error('Failed to emit metrics:', err));
      
      return new Response(JSON.stringify({ metrics, alerts }), {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    }

    // Per spec Section 32.2: Alerts endpoint
    if (path === '/api/alerts') {
      const metrics = metricsCollector.getMetrics();
      const alerts = checkAlertThresholds(metrics);
      
      // Send alerts if any exist
      if (alerts.length > 0 && env.ALERT_WEBHOOK_URL) {
        emitMetrics(metrics, env).catch(err => console.error('Failed to send alerts:', err));
      }
      
      return new Response(JSON.stringify({ alerts }), {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    }

    return new Response('Not Found', {
      status: 404,
      headers: getCorsHeaders(env),
    });
  },
};

async function handleMatchRequest(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  const matchId = path.replace('/api/matches/', '').split('/')[0];

  if (!matchId) {
    return new Response('Match ID required', { status: 400 });
  }

  // Per critique Issue #13: Route WebSocket and match coordination requests to Durable Object
  const upgradeHeader = request.headers.get('Upgrade');
  const isWebSocket = upgradeHeader === 'websocket';
  const isMatchCoordination = path.includes('/state') || 
                              path.includes('/create') || 
                              path.includes('/join') || 
                              path.includes('/move') || 
                              path.includes('/checkpoint') || 
                              path.includes('/sync') || 
                              path.includes('/finalize');
  
  if (isWebSocket || isMatchCoordination) {
    // Route to Durable Object for match coordination
    const id = env.MATCH_COORDINATOR.idFromName(matchId);
    const stub = env.MATCH_COORDINATOR.get(id);
    
    // Forward request to Durable Object with proper path
    const doUrl = new URL(request.url);
    doUrl.pathname = `/match/${matchId}${path.replace(`/api/matches/${matchId}`, '')}`;
    const doRequest = new Request(doUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });
    
    return stub.fetch(doRequest);
  }

  // Per critique Issue #13: Verify Firebase token for write operations
  if ((request.method === 'PUT' || request.method === 'POST' || request.method === 'DELETE') && env.FIREBASE_PROJECT_ID) {
    const authResult = await verifyAuth(request, env.FIREBASE_PROJECT_ID);
    if (authResult.error || !authResult.userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized', message: authResult.error || 'Authentication required' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    }
    // Store userId in request for use in handlers
    // In production, would use Request.context or similar mechanism
    // For now, we pass it via custom header in the request object
  }

  if (request.method === 'PUT' || request.method === 'POST') {
    return uploadMatch(request, env, matchId);
  }

  if (request.method === 'GET') {
    return getMatch(request, env, matchId);
  }

  if (request.method === 'DELETE') {
    return deleteMatch(request, env, matchId);
  }

  return new Response('Method not allowed', { status: 405 });
}

/**
 * Verifies signature on match record upload per spec Section 28.1.
 * Per critique Issue #13: Use CanonicalSerializer instead of JSON.stringify.
 */
async function verifySignature(
  body: string,
  signature: string,
  coordinatorPublicKey: string
): Promise<boolean> {
  try {
    // Import CanonicalJSON for canonical serialization
    const { CanonicalJSON } = await import('./canonical');
    
    // Parse body to extract signature field
    const data = JSON.parse(body);
    
    // Extract signature from request (can be in body or header)
    const providedSignature = signature || data.signature;
    if (!providedSignature || !coordinatorPublicKey) {
      return false;
    }

    // Remove signature from data before verification
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { signature: _sig, ...dataWithoutSig } = data;
    
    // Per critique Issue #13: Use CanonicalSerializer for canonicalization
    // This ensures signature verification matches the canonical format used for hashing
    const canonicalData = CanonicalJSON.stringify(dataWithoutSig);
    const canonicalBytes = new TextEncoder().encode(canonicalData);
    
    // Convert signature from hex string to bytes
    const signatureBytes = hexToBytes(providedSignature);
    
    // Convert public key from hex string to bytes
    const publicKeyBytes = hexToBytes(coordinatorPublicKey);
    
    // Import public key for verification
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      publicKeyBytes,
      {
        name: 'Ed25519',
      },
      false,
      ['verify']
    );
    
    // Verify Ed25519 signature
    const isValid = await crypto.subtle.verify(
      {
        name: 'Ed25519',
      },
      cryptoKey,
      signatureBytes,
      canonicalBytes
    );
    
    return isValid;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Converts hex string to Uint8Array.
 */
function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Rate limiting per spec Section 22.2.
 * Per critique Phase 6.2: Add IP-based rate limiting and rate limit headers.
 */
async function getRateLimitIdentifier(request: Request): Promise<string> {
  // Try to get wallet ID from header
  const walletId = request.headers.get('X-Wallet-Id');
  if (walletId) {
    return `wallet:${walletId}`;
  }

  // Fallback to IP address
  const cfConnectingIp = request.headers.get('CF-Connecting-IP');
  return `ip:${cfConnectingIp || 'unknown'}`;
}

// Per critique Issue #14: In-memory rate limit fallback when KV is not configured
// This ensures rate limiting is always enforced, even without KV
const inMemoryRateLimits = new Map<string, { count: number; resetAt: number }>();

async function checkRateLimit(
  env: Env,
  identifier: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const key = `rate_limit:${identifier}`;
  const now = Date.now();
  
  // Per critique Issue #14: Use KV if available, otherwise use in-memory fallback
  if (env.RATE_LIMIT_KV) {
    try {
      const data = await env.RATE_LIMIT_KV.get(key, 'json');
      if (data && typeof data === 'object' && 'count' in data && 'resetAt' in data) {
        const resetAt = data.resetAt as number;
        if (now < resetAt) {
          const count = (data.count as number) || 0;
          if (count >= limit) {
            return { allowed: false, remaining: 0, resetAt };
          }
          // Increment count
          await env.RATE_LIMIT_KV.put(key, JSON.stringify({ count: count + 1, resetAt }), {
            expirationTtl: Math.floor((resetAt - now) / 1000),
          });
          return { allowed: true, remaining: limit - count - 1, resetAt };
        }
      }
    } catch {
      // Key doesn't exist or invalid, start new window
    }

    // Start new window
    const resetAt = now + windowMs;
    await env.RATE_LIMIT_KV.put(key, JSON.stringify({ count: 1, resetAt }), {
      expirationTtl: Math.floor(windowMs / 1000),
    });

    return { allowed: true, remaining: limit - 1, resetAt };
  } else {
    // Per critique Issue #14: In-memory fallback when KV is not configured
    const existing = inMemoryRateLimits.get(key);
    if (existing && now < existing.resetAt) {
      if (existing.count >= limit) {
        return { allowed: false, remaining: 0, resetAt: existing.resetAt };
      }
      existing.count++;
      return { allowed: true, remaining: limit - existing.count, resetAt: existing.resetAt };
    }
    
    // Start new window
    const resetAt = now + windowMs;
    inMemoryRateLimits.set(key, { count: 1, resetAt });
    
    // Clean up old entries periodically (simple cleanup)
    if (inMemoryRateLimits.size > 10000) {
      for (const [k, v] of inMemoryRateLimits.entries()) {
        if (now >= v.resetAt) {
          inMemoryRateLimits.delete(k);
        }
      }
    }
    
    return { allowed: true, remaining: limit - 1, resetAt };
  }
}

/**
 * Adds rate limit headers to response per spec Section 22.2.
 * Per critique Phase 6.2: Add rate limit headers.
 */
function addRateLimitHeaders(
  headers: Record<string, string>,
  rateLimit: { remaining: number; resetAt: number }
): void {
  headers['X-RateLimit-Remaining'] = String(rateLimit.remaining);
  headers['X-RateLimit-Reset'] = String(Math.floor(rateLimit.resetAt / 1000));
}

/**
 * Per critique Issue #39.3: Validate match record payload structure.
 */
function validateMatchRecord(data: unknown): { valid: boolean; error?: string } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Match record must be an object' };
  }

  const record = data as Record<string, unknown>;
  
  // Validate required fields
  if (!record.match_id && !record.matchId) {
    return { valid: false, error: 'Match record must have match_id or matchId' };
  }
  
  if (!record.version && !record.schema_version) {
    return { valid: false, error: 'Match record must have version or schema_version' };
  }
  
  // Validate version format (semantic version)
  const version = (record.version || record.schema_version) as string;
  if (typeof version !== 'string' || !/^\d+\.\d+\.\d+$/.test(version)) {
    return { valid: false, error: 'Version must be semantic version (e.g., "1.0.0")' };
  }
  
  // Validate events array exists
  if (!Array.isArray(record.events)) {
    return { valid: false, error: 'Match record must have events array' };
  }
  
  // Validate events array size (reasonable limit)
  if (record.events.length > 10000) {
    return { valid: false, error: 'Events array too large (max 10000 events)' };
  }
  
  return { valid: true };
}

async function uploadMatch(request: Request, env: Env, matchId: string): Promise<Response> {
  try {
    // Rate limiting: Configurable via environment variables
    // Default: 100 matches per hour per IP/wallet (production-friendly)
    // Development: 10 per hour (stricter for testing)
    // Per critique Phase 6.2: Add IP-based rate limiting
    const identifier = await getRateLimitIdentifier(request);
    const rateLimitPerHour = env.RATE_LIMIT_MATCHES_PER_HOUR 
      ? parseInt(env.RATE_LIMIT_MATCHES_PER_HOUR, 10) 
      : (env.ENVIRONMENT === 'production' ? 100 : 10); // Production: 100/hour, Dev: 10/hour
    const rateLimit = await checkRateLimit(env, identifier, rateLimitPerHour, 3600000);
    
    if (!rateLimit.allowed) {
      const headers = getCorsHeaders(env);
      addRateLimitHeaders(headers, rateLimit);
      return new Response('Rate limit exceeded', {
        status: 429,
        headers,
      });
    }

    // Verify signature if coordinator key is configured
    const signature = request.headers.get('Signature') || '';
    if (env.COORDINATOR_PUBLIC_KEY && signature) {
      const body = await request.text();
      const isValid = await verifySignature(body, signature, env.COORDINATOR_PUBLIC_KEY);
      if (!isValid) {
        return new Response('Invalid signature', {
          status: 401,
          headers: getCorsHeaders(env),
        });
      }
    }

    const body = await request.text();
    const key = `matches/${matchId}.json`;

    // Per critique Issue #39.3: Validate payload size
    const sizeBytes = new TextEncoder().encode(body).length;
    if (sizeBytes > 10 * 1024 * 1024) {
      return new Response('Match record too large (max 10MB)', {
        status: 413,
        headers: getCorsHeaders(env),
      });
    }
    
    // Per critique Issue #39.3: Validate payload structure
    try {
      const data = JSON.parse(body);
      const validation = validateMatchRecord(data);
      if (!validation.valid) {
        return new Response(`Invalid match record: ${validation.error}`, {
          status: 400,
          headers: getCorsHeaders(env),
        });
      }
    } catch {
      return new Response('Invalid JSON payload', {
        status: 400,
        headers: getCorsHeaders(env),
      });
    }

    const uploadStartTime = Date.now();
    metricsCollector.recordMatchCreated();
    
    await env.MATCHES_BUCKET.put(key, body, {
      httpMetadata: {
        contentType: 'application/json',
      },
    });

    const uploadLatency = (Date.now() - uploadStartTime) / 1000;
    // sizeBytes already calculated above, reuse it
    metricsCollector.recordStorageUpload(true, uploadLatency, sizeBytes);

    const headers = getCorsHeaders(env);
    addRateLimitHeaders(headers, rateLimit);

    return new Response(
      JSON.stringify({
        success: true,
        matchId,
        url: key,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  }
}

async function getMatch(request: Request, env: Env, matchId: string): Promise<Response> {
  try {
    // Per critique Issue #14: Validate signed URL token if present
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    
    if (token) {
      // Validate token signature and expiration
      if (!env.SIGNED_URL_SECRET) {
        return new Response('Signed URL secret not configured', {
          status: 500,
          headers: getCorsHeaders(env),
        });
      }
      
      try {
        const tokenData = JSON.parse(atob(token));
        
        // Check expiration
        if (tokenData.expiresAt && Date.now() > tokenData.expiresAt) {
          return new Response('Signed URL expired', {
            status: 401,
            headers: getCorsHeaders(env),
          });
        }
        
        // Verify HMAC signature
        const { signature, ...dataWithoutSig } = tokenData;
        const tokenString = JSON.stringify(dataWithoutSig);
        const tokenBytes = new TextEncoder().encode(tokenString);
        const secretKey = await crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode(env.SIGNED_URL_SECRET),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['verify']
        );
        
        const signatureBytes = hexToBytes(signature);
        const isValid = await crypto.subtle.verify(
          'HMAC',
          secretKey,
          signatureBytes,
          tokenBytes
        );
        
        if (!isValid) {
          return new Response('Invalid signed URL token', {
            status: 401,
            headers: getCorsHeaders(env),
          });
        }
        
        // Verify matchId matches
        if (tokenData.matchId !== matchId) {
          return new Response('Token matchId mismatch', {
            status: 401,
            headers: getCorsHeaders(env),
          });
        }
      } catch {
        return new Response('Invalid signed URL token format', {
          status: 401,
          headers: getCorsHeaders(env),
        });
      }
    }
    
    const key = `matches/${matchId}.json`;
    const object = await env.MATCHES_BUCKET.get(key);

    if (!object) {
      return new Response('Match not found', {
        status: 404,
        headers: getCorsHeaders(env),
      });
    }

    const body = await object.text();
    return new Response(body, {
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  }
}

async function deleteMatch(request: Request, env: Env, matchId: string): Promise<Response> {
  try {
    // Rate limiting for deletes
    const identifier = await getRateLimitIdentifier(request);
    const rateLimit = await checkRateLimit(env, identifier, 5, 3600000); // 5 per hour
    
    if (!rateLimit.allowed) {
      const headers = getCorsHeaders(env);
      addRateLimitHeaders(headers, rateLimit);
      return new Response('Rate limit exceeded', {
        status: 429,
        headers,
      });
    }

    const key = `matches/${matchId}.json`;
    await env.MATCHES_BUCKET.delete(key);

    const headers = getCorsHeaders(env);
    addRateLimitHeaders(headers, rateLimit);

    return new Response(
      JSON.stringify({
        success: true,
        matchId,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  }
}

/**
 * Generates a signed URL for a match record.
 * Per spec Section 8.2: signed URLs for private match access.
 */
/**
 * Per critique Issue #21, #24: Implement signed URL generation using token-based approach.
 * R2 doesn't support presigned URLs like S3, so we use a token-based system.
 */
async function handleSignedUrlRequest(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: getCorsHeaders(env) });
  }

  try {
    const matchId = path.replace('/api/signed-url/', '').split('/')[0];
    if (!matchId) {
      return new Response('Match ID required', { status: 400, headers: getCorsHeaders(env) });
    }

    // Parse expiration from query params (default: 1 hour)
    const url = new URL(request.url);
    const expirationSeconds = parseInt(url.searchParams.get('expires') || '3600', 10);
    const maxExpiration = 86400; // Max 24 hours
    const expiresIn = Math.min(expirationSeconds, maxExpiration);

    // Per critique Issue #11, #14: Generate token-based signed URL with HMAC signature
    // Since R2 doesn't support presigned URLs, we use a token-based approach
    // The token is a base64-encoded JSON with matchId, expiration, and HMAC signature
    
    if (!env.SIGNED_URL_SECRET) {
      return new Response('Signed URL secret not configured', {
        status: 500,
        headers: getCorsHeaders(env),
      });
    }
    
    const expiresAt = Date.now() + (expiresIn * 1000);
    const tokenData = {
      matchId,
      expiresAt,
    };
    
    // Create HMAC signature
    const tokenString = JSON.stringify(tokenData);
    const tokenBytes = new TextEncoder().encode(tokenString);
    const secretKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(env.SIGNED_URL_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', secretKey, tokenBytes);
    const signatureHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    // Include signature in token data
    const signedTokenData = {
      ...tokenData,
      signature: signatureHex,
    };
    
    // Base64 encode signed token
    const token = btoa(JSON.stringify(signedTokenData));
    
    // Generate signed URL pointing to Worker endpoint that validates token
    const baseUrl = new URL(request.url);
    baseUrl.pathname = `/api/matches/${matchId}`;
    baseUrl.searchParams.set('token', token);
    const signedUrl = baseUrl.toString();

    return new Response(
      JSON.stringify({
        matchId,
        signedUrl,
        expiresIn: expiresIn,
        expiresAt: new Date(expiresAt).toISOString(),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  }
}

/**
 * Handles dispute-related requests.
 * Per spec Section 29: dispute resolution endpoints.
 * Per critique Phase 10: Complete evidence upload and dispute handling.
 */
async function handleDisputeRequest(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  // Per critique Issue #13: Verify Firebase token for dispute operations
  if ((request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') && env.FIREBASE_PROJECT_ID) {
    const authResult = await verifyAuth(request, env.FIREBASE_PROJECT_ID);
    if (authResult.error || !authResult.userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized', message: authResult.error || 'Authentication required' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    }
  }

  // Handle POST /api/disputes (create new dispute)
  if (path === '/api/disputes' && request.method === 'POST') {
    return handleCreateDispute(request, env);
  }

  // Handle POST /api/disputes/{id}/evidence (evidence submission)
  if (path.includes('/evidence') && request.method === 'POST') {
    const disputeId = path.replace('/api/disputes/', '').replace('/evidence', '').split('/')[0];
    if (!disputeId) {
      return new Response('Dispute ID required', { status: 400, headers: getCorsHeaders(env) });
    }
    return handleDisputeEvidenceUpload(request, env, disputeId);
  }

  const disputeId = path.replace('/api/disputes/', '').split('/')[0];

  if (!disputeId) {
    return new Response('Dispute ID required', { status: 400, headers: getCorsHeaders(env) });
  }

  if (request.method === 'GET') {
    try {
      const key = `disputes/${disputeId}.json`;
      const object = await env.MATCHES_BUCKET.get(key);

      if (!object) {
        return new Response('Dispute not found', {
          status: 404,
          headers: getCorsHeaders(env),
        });
      }

      const body = await object.text();
      return new Response(body, {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    }
  }

  if (request.method === 'POST' || request.method === 'PUT') {
    // Regular JSON dispute update
    try {
      const body = await request.text();
      const dispute = JSON.parse(body);
      const key = `disputes/${disputeId}.json`;

      // Add timestamp if not present
      if (!dispute.created_at) {
        dispute.created_at = new Date().toISOString();
      }

      await env.MATCHES_BUCKET.put(key, JSON.stringify(dispute), {
        httpMetadata: {
          contentType: 'application/json',
        },
      });

      return new Response(
        JSON.stringify({
          success: true,
          disputeId,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(env),
          },
        }
      );
    } catch (error) {
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    }
  }

  return new Response('Method not allowed', { status: 405, headers: getCorsHeaders(env) });
}

/**
 * Handles dispute evidence upload (multipart/form-data).
 * Per spec Section 29.1: evidence format and submission.
 */
async function handleDisputeEvidenceUpload(
  request: Request,
  env: Env,
  disputeId: string
): Promise<Response> {
  // Per spec Section 31: Evidence submission endpoint
  // Per critique Issue #13: Verify Firebase token
  if (env.FIREBASE_PROJECT_ID) {
    const authResult = await verifyAuth(request, env.FIREBASE_PROJECT_ID);
    if (authResult.error || !authResult.userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized', message: authResult.error || 'Authentication required' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    }
  }

  try {
    const formData = await request.formData();
    const evidenceFiles: { name: string; key: string; size: number; hash?: string; type?: string }[] = [];
    
    // Extract metadata from form data
    const matchId = formData.get('match_id') as string | null;
    const reason = formData.get('reason') as string | null;
    const description = formData.get('description') as string | null;

    // Process each file in the form data
    // Per spec Section 31.1: File size limits
    const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB max
    // Note: File type validation is optional per spec - we allow all types but log them
    
    for (const [key, value] of formData.entries()) {
      // Skip metadata fields
      if (key === 'match_id' || key === 'reason' || key === 'description') {
        continue;
      }
      
      if (value && typeof value === 'object' && 'name' in value && 'arrayBuffer' in value) {
        const file = value as File;
        
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          return new Response(JSON.stringify({ error: `File ${file.name} exceeds maximum size of 100MB` }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              ...getCorsHeaders(env),
            },
          });
        }
        
        // Validate file type (optional - allow all types but log)
        const fileType = file.type || 'application/octet-stream';
        
        const fileData = await file.arrayBuffer();
        
        // Compute SHA-256 hash for verification
        const hashBuffer = await crypto.subtle.digest('SHA-256', fileData);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = 'sha256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        const evidenceKey = `disputes/evidence/${disputeId}/${file.name}`;
        
        await env.MATCHES_BUCKET.put(evidenceKey, fileData, {
          httpMetadata: {
            contentType: fileType,
          },
        });

        evidenceFiles.push({
          name: file.name,
          key: evidenceKey,
          size: fileData.byteLength,
          hash: hashHex,
          type: fileType,
        });
      }
    }

    // Update dispute record with evidence references
    const disputeKey = `disputes/${disputeId}.json`;
    let dispute: Record<string, unknown> = {};
    
    try {
      const disputeObject = await env.MATCHES_BUCKET.get(disputeKey);
      if (disputeObject) {
        dispute = JSON.parse(await disputeObject.text());
      }
    } catch {
      // Dispute doesn't exist yet, create it
      dispute.dispute_id = disputeId;
      dispute.created_at = new Date().toISOString();
    }

    // Update dispute with metadata if provided
    if (matchId) dispute.match_id = matchId;
    if (reason) dispute.reason = reason;
    if (description) dispute.description = description;

    // Add evidence files to dispute record
    const existingEvidence = Array.isArray(dispute.evidence) ? dispute.evidence as unknown[] : [];
    const newEvidence = evidenceFiles.map(f => ({
      filename: f.name,
      type: f.type || 'application/octet-stream',
      size_bytes: f.size,
      hash: f.hash,
      url: f.key, // In production, generate signed URL
      uploaded_at: new Date().toISOString(),
    }));
    
    dispute.evidence = [...existingEvidence, ...newEvidence];
    dispute.evidence_updated_at = new Date().toISOString();

    // Compute evidence package hash (hash of all file hashes)
    const allHashes = newEvidence.map(e => (e as { hash: string }).hash).join(',');
    const packageHashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(allHashes));
    const packageHashArray = Array.from(new Uint8Array(packageHashBuffer));
    const packageHashHex = 'sha256:' + packageHashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    dispute.evidence_package_hash = packageHashHex;

    await env.MATCHES_BUCKET.put(disputeKey, JSON.stringify(dispute, null, 2), {
      httpMetadata: {
        contentType: 'application/json',
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        dispute_id: disputeId,
        evidence_package_hash: packageHashHex,
        evidence_files: evidenceFiles.length,
        evidence: newEvidence,
        uploaded_at: new Date().toISOString(),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  }
}

/**
 * Handles new dispute creation.
 * Per spec Section 29: creates dispute and assigns validators.
 */
async function handleCreateDispute(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Check if multipart/form-data (evidence upload)
    const contentType = request.headers.get('Content-Type') || '';
    if (contentType.includes('multipart/form-data')) {
      // Generate dispute ID
      const disputeId = `dispute-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      return handleDisputeEvidenceUpload(request, env, disputeId);
    }

    // Regular JSON dispute creation
    const body = await request.text();
    const disputeData = JSON.parse(body);

    // Generate dispute ID if not provided
    const disputeId = disputeData.dispute_id || `dispute-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    disputeData.dispute_id = disputeId;
    disputeData.created_at = disputeData.created_at || new Date().toISOString();
    disputeData.status = 'pending';

    // Store dispute
    const key = `disputes/${disputeId}.json`;
    await env.MATCHES_BUCKET.put(key, JSON.stringify(disputeData), {
      httpMetadata: {
        contentType: 'application/json',
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        disputeId,
        dispute: disputeData,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  }
}

/**
 * Handles AI-related requests.
 * Per spec Section 8.3: AI integration endpoints.
 */
async function handleAIRequest(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  if (path === '/api/ai/on_event' && request.method === 'POST') {
    return handleAIEvent(request, env);
  }

  return new Response('Not Found', { status: 404, headers: getCorsHeaders(env) });
}

/**
 * Handles AI event requests per spec Section 8.3 line 421.
 * POST /api/ai/on_event
 */
async function handleAIEvent(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body = await request.text();
    const eventRequest = JSON.parse(body);

    // Call external AI service if configured
    let aiResponse: unknown = null;
    if (env.AI_SERVICE_URL) {
      try {
        const response = await fetch(env.AI_SERVICE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(env.AI_API_KEY ? { 'Authorization': `Bearer ${env.AI_API_KEY}` } : {}),
          },
          body: JSON.stringify(eventRequest),
        });

        if (response.ok) {
          aiResponse = await response.json();
        }
      } catch (error) {
        console.error('Failed to call AI service:', error);
      }
    }

    // Store AI decision in R2 for later verification
    if (aiResponse && eventRequest.matchId && eventRequest.playerId) {
      const decisionKey = `ai-decisions/${eventRequest.matchId}/${eventRequest.playerId}-${Date.now()}.json`;
      await env.MATCHES_BUCKET.put(decisionKey, JSON.stringify({
        ...aiResponse,
        eventRequest,
        recordedAt: new Date().toISOString(),
      }), {
        httpMetadata: {
          contentType: 'application/json',
        },
      });
    }

    return new Response(
      JSON.stringify(aiResponse || { error: 'AI service not available' }),
      {
        status: aiResponse ? 200 : 503,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      }
    );
  }
}

/**
 * Handles listing matches for exploration
 */
async function handleListMatches(request: Request, env: Env): Promise<Response> {
  try {
    const matches: unknown[] = [];
    let cursor: string | undefined;
    let hasMore = true;
    const maxMatches = 1000;
    
    while (hasMore && matches.length < maxMatches) {
      const listResult = await env.MATCHES_BUCKET.list({
        prefix: 'matches/',
        limit: 100,
        ...(cursor ? { cursor } : {}),
      });
      
      for (const object of listResult.objects) {
        if (object.key.endsWith('.json') && !object.key.includes('/anonymized/')) {
          try {
            const matchObject = await env.MATCHES_BUCKET.get(object.key);
            if (matchObject) {
              const matchData = JSON.parse(await matchObject.text());
              matches.push(matchData);
            }
          } catch (error) {
            console.error('Error parsing match ' + object.key + ':', error);
          }
        }
      }
      
      hasMore = listResult.truncated;
      if (hasMore && 'cursor' in listResult) {
        cursor = listResult.cursor;
      } else {
        hasMore = false;
      }
    }
    
    matches.sort((a, b) => {
      const aRecord = a as Record<string, unknown>;
      const bRecord = b as Record<string, unknown>;
      const timeA = aRecord.start_time || aRecord.createdAt || 0;
      const timeB = bRecord.start_time || bRecord.createdAt || 0;
      return new Date(timeB as string | number).getTime() - new Date(timeA as string | number).getTime();
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        matches,
        count: matches.length,
        total_fetched: matches.length,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: String(error),
        matches: [],
        count: 0,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      }
    );
  }
}

/**
 * Handles listing benchmark matches (AI vs AI with model metadata)
 */
async function handleListBenchmarks(request: Request, env: Env): Promise<Response> {
  try {
    const benchmarks: unknown[] = [];
    let cursor: string | undefined;
    let hasMore = true;
    const maxMatches = 1000;
    
    while (hasMore && benchmarks.length < maxMatches) {
      const listResult = await env.MATCHES_BUCKET.list({
        prefix: 'matches/',
        limit: 100,
        ...(cursor ? { cursor } : {}),
      });
      
      for (const object of listResult.objects) {
        if (object.key.endsWith('.json') && !object.key.includes('/anonymized/')) {
          try {
            const matchObject = await env.MATCHES_BUCKET.get(object.key);
            if (matchObject) {
              const matchData = JSON.parse(await matchObject.text());
              const players = matchData.players || [];
              
              // Filter for AI vs AI matches with model metadata (benchmark matches)
              const aiPlayers = players.filter((p: Record<string, unknown>) => 
                (p.type === 'ai' || p.player_type === 'ai') && 
                ((p.metadata as Record<string, unknown>)?.model_name || (p.metadata as Record<string, unknown>)?.model_id || matchData.chain_of_thought)
              );
              
              if (aiPlayers.length >= 2) {
                benchmarks.push(matchData);
              }
            }
          } catch (error) {
            console.error(`Error parsing match ${object.key}:`, error);
          }
        }
      }
      
      hasMore = listResult.truncated;
      if (hasMore && 'cursor' in listResult) {
        cursor = listResult.cursor;
      } else {
        hasMore = false;
      }
    }
    
    benchmarks.sort((a, b) => {
      const aRecord = a as Record<string, unknown>;
      const bRecord = b as Record<string, unknown>;
      const timeA = aRecord.start_time || aRecord.createdAt || 0;
      const timeB = bRecord.start_time || bRecord.createdAt || 0;
      return new Date(timeB as string | number).getTime() - new Date(timeA as string | number).getTime();
    });
    
    return new Response(
      JSON.stringify({
        success: true,
        benchmarks,
        count: benchmarks.length,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: String(error),
        benchmarks: [],
        count: 0,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      }
    );
  }
}

/**
 * Handles archive requests.
 * Per spec Section 8.2: archive match records for long-term storage.
 */
async function handleArchiveRequest(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: getCorsHeaders(env) });
  }

  try {
    const matchId = path.replace('/api/archive/', '').split('/')[0];
    if (!matchId) {
      return new Response('Match ID required', { status: 400, headers: getCorsHeaders(env) });
    }

    // Move match from matches/ to archive/ folder
    const sourceKey = `matches/${matchId}.json`;
    const archiveKey = `archive/${matchId}.json`;

    const object = await env.MATCHES_BUCKET.get(sourceKey);
    if (!object) {
      return new Response('Match not found', {
        status: 404,
        headers: getCorsHeaders(env),
      });
    }

    const body = await object.text();
    await env.MATCHES_BUCKET.put(archiveKey, body, {
      httpMetadata: {
        contentType: 'application/json',
      },
    });

    // Delete original (optional - you might want to keep both)
    // await env.MATCHES_BUCKET.delete(sourceKey);

      return new Response(
      JSON.stringify({
        success: true,
        matchId,
        archivedAt: new Date().toISOString(),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  }
}

/**
 * Handles data export requests (GDPR compliance).
 * Per spec Section 31.2: GET /users/:user_id/export
 * Per critique Phase 10.3: Complete privacy/GDPR endpoints.
 */
async function handleDataExportRequest(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  // Per spec Section 31.2: GDPR data export endpoint
  // Per critique Issue #13: Verify Firebase token
  if (env.FIREBASE_PROJECT_ID) {
    const authResult = await verifyAuth(request, env.FIREBASE_PROJECT_ID);
    if (authResult.error || !authResult.userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized', message: authResult.error || 'Authentication required' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    }
  }

  if (request.method !== 'GET') {
    return new Response('Method not allowed', { status: 405, headers: getCorsHeaders(env) });
  }

  try {
    // Extract user ID from path or use authenticated user ID
    let userId = path.replace('/api/data-export/', '').split('/')[0];
    if (!userId && env.FIREBASE_PROJECT_ID) {
      const authResult = await verifyAuth(request, env.FIREBASE_PROJECT_ID);
      userId = authResult.userId;
    }
    
    if (!userId) {
      return new Response('User ID required', { status: 400, headers: getCorsHeaders(env) });
    }

    // Find all matches for this user (by wallet address or user ID)
    const matches: unknown[] = [];
    const disputes: unknown[] = [];
    
    // List all matches and filter by user
    const listResult = await env.MATCHES_BUCKET.list({ prefix: 'matches/' });
    
    for (const key of listResult.objects) {
      try {
        const object = await env.MATCHES_BUCKET.get(key.key);
        if (object) {
          const matchRecord = JSON.parse(await object.text());
          // Check if user is a player in this match
          const isPlayer = matchRecord.players?.some((p: { player_id?: string; public_key?: string; pubkey?: string }) => 
            p.player_id === userId || p.public_key === userId || p.pubkey === userId
          );
          if (isPlayer) {
            matches.push(matchRecord);
          }
        }
      } catch (error) {
        console.error(`Failed to process match ${key.key}:`, error);
      }
    }

    // List disputes for this user
    try {
      const disputeListResult = await env.MATCHES_BUCKET.list({ prefix: 'disputes/' });
      for (const key of disputeListResult.objects) {
        try {
          const object = await env.MATCHES_BUCKET.get(key.key);
          if (object) {
            const dispute = JSON.parse(await object.text()) as Record<string, unknown>;
            const disputeUserId = dispute.user_id as string | undefined;
            const disputeMatchId = dispute.match_id as string | undefined;
            if (disputeUserId === userId || (disputeMatchId && matches.some((m: unknown) => {
              const match = m as { match_id?: string };
              return match.match_id === disputeMatchId;
            }))) {
              disputes.push(dispute);
            }
          }
        } catch (error) {
          console.error(`Failed to process dispute ${key.key}:`, error);
        }
      }
    } catch (error) {
      // Disputes might not exist, that's OK
      console.warn('Failed to list disputes:', error);
    }

    return new Response(
      JSON.stringify({
        user_id: userId,
        matches,
        disputes,
        exported_at: new Date().toISOString(),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  }
}

/**
 * Handles leaderboard requests.
 * Per spec Section 20.1.6: Leaderboard system (per game type + per season).
 * 
 * NOTE: These endpoints require an off-chain indexer (PostgreSQL + Redis) or
 * direct Solana RPC queries to GameLeaderboard accounts.
 * 
 * Current implementation: Returns placeholder responses.
 * To implement:
 * 1. Add Solana RPC client to query GameLeaderboard PDAs
 * 2. Or integrate with off-chain indexer service
 * 3. Cache results in R2 or KV for performance
 */
async function handleLeaderboardRequest(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  try {
    // Parse path: /api/leaderboard/:game_type/...
    const pathParts = path.replace('/api/leaderboard/', '').split('/');
    const gameType = pathParts[0];
    const action = pathParts[1];
    const userId = pathParts[2];

    // Validate game type (0=CLAIM, 1=Poker, 2=WordSearch, etc.)
    const gameTypeNum = parseInt(gameType, 10);
    if (isNaN(gameTypeNum) || gameTypeNum < 0) {
      return new Response(JSON.stringify({ 
        error: 'Invalid game type',
        message: 'Game type must be a number (0=CLAIM, 1=Poker, 2=WordSearch, etc.)',
        available_game_types: {
          0: 'CLAIM',
          1: 'Poker',
          2: 'WordSearch',
        }
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    }

    // Get query parameters
    const url = new URL(request.url);
    const seasonId = url.searchParams.get('season_id');
    const limit = parseInt(url.searchParams.get('limit') || '100', 10);
    const tier = url.searchParams.get('tier');
    const range = parseInt(url.searchParams.get('range') || '5', 10);

    // Route to appropriate handler
    if (action === 'tier' && tier) {
      // GET /api/leaderboard/:game_type/tier?tier=X&season_id=Y
      return new Response(JSON.stringify({
        message: 'Leaderboard tier endpoint not yet implemented',
        note: 'This endpoint requires an off-chain indexer to compute tiers from lifetime_gp_earned',
        implementation_required: [
          'Off-chain indexer (PostgreSQL + Redis)',
          'Tier calculation: Bronze (0-999 GP), Silver (1000-4999), Gold (5000-19999), Platinum (20000-49999), Diamond (50000-99999), Master (100000+)',
          'Query: SELECT * FROM leaderboard_entries WHERE game_type = ? AND tier = ? AND season_id = ? ORDER BY score DESC LIMIT ?'
        ],
        request_params: {
          game_type: gameTypeNum,
          tier,
          season_id: seasonId,
        }
      }), {
        status: 501, // Not Implemented
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    } else if (action === 'user' && userId) {
      // GET /api/leaderboard/:game_type/user/:user_id?season_id=Y
      return new Response(JSON.stringify({
        message: 'User leaderboard rank endpoint not yet implemented',
        note: 'This endpoint requires querying UserAccount on Solana or off-chain indexer',
        implementation_required: [
          'Query Solana UserAccount PDA for user_id',
          'Or query off-chain indexer: SELECT rank, tier, score FROM leaderboard_entries WHERE game_type = ? AND user_id = ? AND season_id = ?',
          'Return: { user_id, rank, tier, score, wins, games_played, season_id }'
        ],
        request_params: {
          game_type: gameTypeNum,
          user_id: userId,
          season_id: seasonId,
        }
      }), {
        status: 501,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    } else if (action === 'nearby' && userId) {
      // GET /api/leaderboard/:game_type/nearby/:user_id?range=5&season_id=Y
      return new Response(JSON.stringify({
        message: 'Nearby players endpoint not yet implemented',
        note: 'This endpoint requires off-chain indexer to find players above/below user rank',
        implementation_required: [
          'Query user rank from indexer',
          'SELECT * FROM leaderboard_entries WHERE game_type = ? AND season_id = ? AND rank BETWEEN ? AND ? ORDER BY rank',
          'Return: { above: [...], user: {...}, below: [...] }'
        ],
        request_params: {
          game_type: gameTypeNum,
          user_id: userId,
          range,
          season_id: seasonId,
        }
      }), {
        status: 501,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    } else {
      // GET /api/leaderboard/:game_type?season_id=Y&limit=N
      // This could query Solana GameLeaderboard PDA directly (top 100 on-chain)
      return new Response(JSON.stringify({
        message: 'Leaderboard endpoint not yet implemented',
        note: 'Top 100 is stored on-chain in Solana GameLeaderboard PDA. Full rankings require off-chain indexer.',
        implementation_options: [
          {
            method: 'Query Solana directly',
            description: 'Query GameLeaderboard PDA using Solana RPC',
            pda_seeds: ['leaderboard', gameTypeNum, seasonId || 'current'],
            returns: 'Top 100 entries (on-chain only)',
            limitation: 'Only top 100, no tier filtering, no full rankings'
          },
          {
            method: 'Query off-chain indexer',
            description: 'Query PostgreSQL/Redis indexer for full rankings',
            returns: 'Full rankings, tier filtering, nearby players',
            recommended: true
          }
        ],
        spec_reference: 'Section 20.1.6: Leaderboard System (Per Game Type + Per Season)',
        request_params: {
          game_type: gameTypeNum,
          season_id: seasonId || 'current',
          limit: Math.min(limit, 1000),
        },
        expected_response_format: {
          game_type: gameTypeNum,
          season_id: 'number',
          entries: [
            {
              rank: 1,
              user_id: 'string',
              score: 'number',
              wins: 'number',
              games_played: 'number',
              tier: 'Bronze|Silver|Gold|Platinum|Diamond|Master',
              timestamp: 'ISO8601'
            }
          ],
          total_entries: 'number',
          last_updated: 'ISO8601'
        }
      }), {
        status: 501,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  }
}

/**
 * Handles test-only requests (DEVELOPMENT ONLY).
 * WARNING: These endpoints are DANGEROUS and should NEVER be enabled in production.
 * 
 * Available endpoints:
 * - DELETE /api/test/clear-all?confirm=true - Clears ALL records from R2 (matches, disputes, evidence, archive)
 */
async function handleTestRequest(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  // CRITICAL SAFETY CHECKS:
  // 1. Must be development environment
  // 2. Must be test bucket (claim-matches-test)
  if (env.ENVIRONMENT !== 'development') {
    return new Response(JSON.stringify({ 
      error: 'Forbidden',
      message: 'Test endpoints are only available in development environment'
    }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  }

  // Check bucket name - ONLY allow clearing test bucket
  const bucketName = env.BUCKET_NAME || 'unknown';
  if (bucketName !== 'claim-matches-test') {
    return new Response(JSON.stringify({ 
      error: 'Forbidden',
      message: 'Clear operation is only allowed on test bucket (claim-matches-test)',
      current_bucket: bucketName,
      required_bucket: 'claim-matches-test',
      warning: 'This safety check prevents accidental deletion of production data'
    }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  }

  try {
    if (path === '/api/test/clear-all' && request.method === 'DELETE') {
      // Require confirmation via query parameter
      const url = new URL(request.url);
      const confirm = url.searchParams.get('confirm');
      
      if (confirm !== 'true') {
        return new Response(JSON.stringify({
          error: 'Confirmation required',
          message: 'This will DELETE ALL records from R2. Add ?confirm=true to proceed.',
          warning: '⚠️  THIS IS IRREVERSIBLE! All matches, disputes, evidence, and archived records will be deleted.',
          bucket_name: bucketName,
          endpoint: '/api/test/clear-all?confirm=true',
          method: 'DELETE',
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...getCorsHeaders(env),
          },
        });
      }

      console.warn(`[TEST] Clearing all records from R2 bucket: ${bucketName}`);
      console.warn(`[TEST] Safety checks passed: ENVIRONMENT=${env.ENVIRONMENT}, BUCKET_NAME=${bucketName}`);
      
      let deletedCount = 0;
      let errorCount = 0;
      const prefixes = ['matches/', 'disputes/', 'archive/', 'matches/anonymized/'];

      // Delete all objects with each prefix
      for (const prefix of prefixes) {
        try {
          let cursor: string | undefined;
          let hasMore = true;
          
          while (hasMore) {
            const listResult = await env.MATCHES_BUCKET.list({
              prefix,
              ...(cursor ? { cursor } : {}),
            });

            // Delete in batches
            const deletePromises = listResult.objects.map(async (obj) => {
              try {
                await env.MATCHES_BUCKET.delete(obj.key);
                deletedCount++;
                return true;
              } catch (error) {
                console.error(`Failed to delete ${obj.key}:`, error);
                errorCount++;
                return false;
              }
            });

            await Promise.all(deletePromises);
            
            // Check if there are more results
            hasMore = listResult.truncated;
            if (hasMore && 'cursor' in listResult) {
              cursor = listResult.cursor;
            } else {
              hasMore = false;
            }
          }
        } catch (error) {
          console.error(`Error listing/deleting prefix ${prefix}:`, error);
          errorCount++;
        }
      }

      console.warn(`[TEST] Cleared ${deletedCount} records, ${errorCount} errors`);

      return new Response(JSON.stringify({
        success: true,
        message: 'All records cleared from R2',
        bucket_name: bucketName,
        deleted_count: deletedCount,
        error_count: errorCount,
        cleared_at: new Date().toISOString(),
        warning: 'This operation is irreversible. All data has been deleted.',
        safety_checks: {
          environment: env.ENVIRONMENT,
          bucket_name: bucketName,
          allowed: bucketName === 'claim-matches-test',
        },
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    }

    // Unknown test endpoint
    return new Response(JSON.stringify({
      error: 'Not Found',
      message: 'Unknown test endpoint',
      available_endpoints: [
        'DELETE /api/test/clear-all?confirm=true - Clear all records from R2'
      ],
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      message: String(error)
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  }
}

/**
 * Handles data deletion requests (GDPR compliance).
 * Per spec Section 31.2: DELETE /users/:user_id/data
 * Per critique Phase 10.3: Complete privacy/GDPR endpoints.
 */
async function handleDataDeletionRequest(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  // Per spec Section 31.2: GDPR data deletion endpoint
  // Per critique Issue #13: Verify Firebase token
  if (env.FIREBASE_PROJECT_ID) {
    const authResult = await verifyAuth(request, env.FIREBASE_PROJECT_ID);
    if (authResult.error || !authResult.userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized', message: authResult.error || 'Authentication required' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      });
    }
  }

  if (request.method !== 'DELETE') {
    return new Response('Method not allowed', { status: 405, headers: getCorsHeaders(env) });
  }

  try {
    // Extract user ID from path or use authenticated user ID
    let userId = path.replace('/api/data/', '').split('/')[0];
    if (!userId && env.FIREBASE_PROJECT_ID) {
      const authResult = await verifyAuth(request, env.FIREBASE_PROJECT_ID);
      userId = authResult.userId;
    }
    
    if (!userId) {
      return new Response('User ID required', { status: 400, headers: getCorsHeaders(env) });
    }

    // Parse request body for confirmation
    let confirm = false;
    try {
      const body = await request.json() as { confirm?: boolean };
      confirm = body.confirm === true;
    } catch {
      // Body might be empty, require confirmation via query param or header
      const url = new URL(request.url);
      confirm = url.searchParams.get('confirm') === 'true';
    }

    if (!confirm) {
      return new Response(
        JSON.stringify({ error: 'Confirmation required. Set confirm=true in request body or query param.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...getCorsHeaders(env) } }
      );
    }

    // Find and delete all matches for this user
    const deletedMatches: string[] = [];
    const deletedDisputes: string[] = [];
    const deletedEvidence: string[] = [];
    
    // Delete matches
    const listResult = await env.MATCHES_BUCKET.list({ prefix: 'matches/' });
    for (const key of listResult.objects) {
      try {
        const object = await env.MATCHES_BUCKET.get(key.key);
        if (object) {
          const matchRecord = JSON.parse(await object.text());
          // Check if user is a player in this match
          const isPlayer = matchRecord.players?.some((p: { player_id?: string; public_key?: string; pubkey?: string }) => 
            p.player_id === userId || p.public_key === userId || p.pubkey === userId
          );
          if (isPlayer) {
            await env.MATCHES_BUCKET.delete(key.key);
            deletedMatches.push(matchRecord.match_id || matchRecord.matchId || key.key);
          }
        }
      } catch (error) {
        console.error(`Failed to delete match ${key.key}:`, error);
      }
    }

    // Delete disputes
    try {
      const disputeListResult = await env.MATCHES_BUCKET.list({ prefix: 'disputes/' });
      for (const key of disputeListResult.objects) {
        try {
          const object = await env.MATCHES_BUCKET.get(key.key);
          if (object) {
            const dispute = JSON.parse(await object.text());
            if (dispute.user_id === userId) {
              await env.MATCHES_BUCKET.delete(key.key);
              deletedDisputes.push(dispute.dispute_id || key.key);
            }
          }
        } catch (error) {
          console.error(`Failed to delete dispute ${key.key}:`, error);
        }
      }
    } catch (error) {
      // Disputes might not exist
      console.warn('Failed to list disputes:', error);
    }

    // Delete evidence (stored in disputes/evidence/)
    try {
      const evidenceListResult = await env.MATCHES_BUCKET.list({ prefix: 'disputes/evidence/' });
      for (const key of evidenceListResult.objects) {
        // Check if evidence belongs to deleted disputes
        if (deletedDisputes.some(d => key.key.includes(d))) {
          try {
            await env.MATCHES_BUCKET.delete(key.key);
            deletedEvidence.push(key.key);
          } catch (error) {
            console.error(`Failed to delete evidence ${key.key}:`, error);
          }
        }
      }
    } catch (error) {
      // Evidence might not exist
      console.warn('Failed to list evidence:', error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        deleted_items: {
          matches: deletedMatches.length,
          disputes: deletedDisputes.length,
          evidence: deletedEvidence.length,
        },
        deleted_at: new Date().toISOString(),
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  }
}

/**
 * Handles match anonymization requests (GDPR compliance).
 * Per spec Section 31.3: POST /matches/:match_id/anonymize
 * Per critique Phase 10.3: Complete privacy/GDPR endpoints.
 */
async function handleAnonymizeRequest(
  request: Request,
  env: Env,
  path: string
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: getCorsHeaders(env) });
  }

  try {
    const matchId = path.replace('/api/matches/', '').replace('/anonymize', '').split('/')[0];
    if (!matchId) {
      return new Response('Match ID required', { status: 400, headers: getCorsHeaders(env) });
    }

    // Load match record
    const matchKey = `matches/${matchId}.json`;
    const object = await env.MATCHES_BUCKET.get(matchKey);
    if (!object) {
      return new Response('Match not found', { status: 404, headers: getCorsHeaders(env) });
    }

    const matchRecord = JSON.parse(await object.text());

    // Anonymize match record per spec Section 31.3
    const anonymized: Record<string, unknown> = { ...matchRecord };

    // Anonymize players
    if (anonymized.players && Array.isArray(anonymized.players)) {
      anonymized.players = (anonymized.players as Array<Record<string, unknown>>).map((player: Record<string, unknown>, index: number) => {
        const anonymizedPlayer: Record<string, unknown> = {
          player_id: `Player${index + 1}`, // Replace with pseudonym
          type: player.type,
        };

        // Hash wallet addresses (one-way)
        const playerPublicKey = player.public_key as string | undefined;
        const playerPubkey = player.pubkey as string | undefined;
        if (playerPublicKey || playerPubkey) {
          // Simple hash for demonstration (in production, use proper crypto hash)
          const address = playerPublicKey || playerPubkey || '';
          anonymizedPlayer.public_key = `hashed_${address.substring(0, 8)}...`;
        }

        // Remove PII from metadata
        const playerMetadata = player.metadata as Record<string, unknown> | undefined;
        if (playerMetadata) {
          const cleanMetadata: Record<string, unknown> = {};
          // Keep only non-PII fields
          if (playerMetadata.model_name) cleanMetadata.model_name = playerMetadata.model_name;
          if (playerMetadata.model_id) cleanMetadata.model_id = playerMetadata.model_id;
          anonymizedPlayer.metadata = cleanMetadata;
        }

        return anonymizedPlayer;
      });
    }

    // Remove hot_url if it contains PII
    const storage = anonymized.storage as { hot_url?: string } | undefined;
    if (storage && 'hot_url' in storage) {
      delete storage.hot_url;
    }
    if (anonymized.hotUrl) {
      delete anonymized.hotUrl;
    }

    // Save anonymized version
    const anonymizedKey = `matches/anonymized/${matchId}.json`;
    await env.MATCHES_BUCKET.put(anonymizedKey, JSON.stringify(anonymized, null, 2), {
      httpMetadata: {
        contentType: 'application/json',
      },
    });

    // Generate anonymized URL (if R2 public URL is configured)
    const anonymizedUrl = anonymizedKey; // In production, generate signed URL

    return new Response(
      JSON.stringify({
        success: true,
        match_id: matchId,
        anonymized_at: new Date().toISOString(),
        anonymized_url: anonymizedUrl,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...getCorsHeaders(env),
        },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...getCorsHeaders(env),
      },
    });
  }
}
