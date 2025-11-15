/**
 * OpenAPI/Swagger documentation for the Claim Storage API
 * Accessible at /api/docs or /openapi.json
 */

export const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Claim Storage API',
    description: 'API for storing and managing game match records, disputes, and AI decisions',
    version: '1.0.0',
    contact: {
      name: 'Ocentra Games',
      url: 'https://game.ocentra.ca',
    },
  },
  servers: [
    {
      url: 'https://claim-storage-dev.ocentraai.workers.dev',
      description: 'Development server',
    },
    {
      url: 'https://claim-storage.ocentraai.workers.dev',
      description: 'Production server',
    },
  ],
  tags: [
    { name: 'Matches', description: 'Match record operations' },
    { name: 'Signed URLs', description: 'Signed URL generation for private access' },
    { name: 'Disputes', description: 'Dispute resolution and evidence management' },
    { name: 'Archive', description: 'Match archiving operations' },
    { name: 'AI', description: 'AI decision and event handling' },
    { name: 'GDPR', description: 'Privacy and data management endpoints' },
    { name: 'Leaderboard', description: 'Leaderboard and ranking endpoints (requires indexer)' },
    { name: 'Health', description: 'Health check and monitoring' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Returns the health status of the API',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/metrics': {
      get: {
        tags: ['Health'],
        summary: 'Get metrics',
        description: 'Returns system metrics and alerts',
        responses: {
          '200': {
            description: 'Metrics data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    metrics: { type: 'object' },
                    alerts: {
                      type: 'array',
                      items: { type: 'object' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/matches/{matchId}': {
      get: {
        tags: ['Matches'],
        summary: 'Get match record',
        description: 'Retrieves a match record by ID',
        parameters: [
          {
            name: 'matchId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Unique match identifier',
          },
          {
            name: 'token',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Signed URL token for private access',
          },
        ],
        responses: {
          '200': {
            description: 'Match record found',
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          },
          '404': {
            description: 'Match not found',
            content: {
              'text/plain': {
                schema: { type: 'string', example: 'Match not found' },
              },
            },
          },
        },
      },
      put: {
        tags: ['Matches'],
        summary: 'Upload match record',
        description: 'Uploads or updates a match record. Requires authentication in production.',
        parameters: [
          {
            name: 'matchId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'Unique match identifier',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['match_id', 'version', 'players', 'events'],
                properties: {
                  match_id: { type: 'string' },
                  version: { type: 'string' },
                  game_type: { type: 'string' },
                  created_at: { type: 'string', format: 'date-time' },
                  ended_at: { type: 'string', format: 'date-time' },
                  players: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        player_id: { type: 'string' },
                        wallet_address: { type: 'string' },
                        player_type: { type: 'string', enum: ['human', 'ai'] },
                        score: { type: 'number' },
                      },
                    },
                  },
                  events: {
                    type: 'array',
                    items: { type: 'object' },
                  },
                  metadata: { type: 'object' },
                },
              },
            },
          },
        },
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          '200': {
            description: 'Match record uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    matchId: { type: 'string' },
                    url: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid match record',
          },
          '401': {
            description: 'Unauthorized - authentication required',
          },
          '413': {
            description: 'Match record too large (max 10MB)',
          },
          '429': {
            description: 'Rate limit exceeded',
          },
        },
      },
      delete: {
        tags: ['Matches'],
        summary: 'Delete match record',
        description: 'Deletes a match record. Requires authentication in production.',
        parameters: [
          {
            name: 'matchId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          '200': {
            description: 'Match record deleted',
          },
          '401': {
            description: 'Unauthorized',
          },
          '404': {
            description: 'Match not found',
          },
        },
      },
    },
    '/api/matches/{matchId}/anonymize': {
      post: {
        tags: ['GDPR'],
        summary: 'Anonymize match record',
        description: 'Creates an anonymized version of a match record for GDPR compliance',
        parameters: [
          {
            name: 'matchId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          '200': {
            description: 'Match anonymized successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    match_id: { type: 'string' },
                    anonymized_at: { type: 'string', format: 'date-time' },
                    anonymized_url: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Bad request',
          },
          '401': {
            description: 'Unauthorized',
          },
          '404': {
            description: 'Match not found',
          },
        },
      },
    },
    '/api/signed-url/{matchId}': {
      get: {
        tags: ['Signed URLs'],
        summary: 'Generate signed URL',
        description: 'Generates a time-limited signed URL for accessing a match record',
        parameters: [
          {
            name: 'matchId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'expires',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 3600 },
            description: 'Expiration time in seconds (max 86400)',
          },
        ],
        responses: {
          '200': {
            description: 'Signed URL generated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    matchId: { type: 'string' },
                    signedUrl: { type: 'string' },
                    expiresIn: { type: 'integer' },
                    expiresAt: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid request',
          },
          '500': {
            description: 'Signed URL secret not configured',
          },
        },
      },
    },
    '/api/disputes': {
      post: {
        tags: ['Disputes'],
        summary: 'Create dispute',
        description: 'Creates a new dispute for a match. Requires authentication in production.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['match_id', 'reason'],
                properties: {
                  match_id: { type: 'string' },
                  reason: { type: 'string' },
                  reason_hash: { type: 'string' },
                  created_by: { type: 'string' },
                  timestamp: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          '200': {
            description: 'Dispute created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    disputeId: { type: 'string' },
                    dispute: { type: 'object' },
                  },
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/api/disputes/{disputeId}': {
      get: {
        tags: ['Disputes'],
        summary: 'Get dispute',
        description: 'Retrieves a dispute by ID',
        parameters: [
          {
            name: 'disputeId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Dispute found',
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          },
          '404': {
            description: 'Dispute not found',
          },
        },
      },
    },
    '/api/disputes/{disputeId}/evidence': {
      post: {
        tags: ['Disputes'],
        summary: 'Upload dispute evidence',
        description: 'Uploads evidence files for a dispute. Requires multipart/form-data. Requires authentication in production.',
        parameters: [
          {
            name: 'disputeId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  evidence: {
                    type: 'string',
                    format: 'binary',
                    description: 'Evidence file (max 100MB)',
                  },
                  match_id: { type: 'string' },
                  reason: { type: 'string' },
                  description: { type: 'string' },
                },
              },
            },
          },
        },
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          '200': {
            description: 'Evidence uploaded successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    dispute_id: { type: 'string' },
                    evidence_package_hash: { type: 'string' },
                    evidence_files: { type: 'integer' },
                    evidence: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          filename: { type: 'string' },
                          type: { type: 'string' },
                          size_bytes: { type: 'integer' },
                          hash: { type: 'string' },
                          url: { type: 'string' },
                          uploaded_at: { type: 'string', format: 'date-time' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'File too large or invalid',
          },
          '401': {
            description: 'Unauthorized',
          },
        },
      },
    },
    '/api/archive/{matchId}': {
      post: {
        tags: ['Archive'],
        summary: 'Archive match record',
        description: 'Moves a match record to archive storage',
        parameters: [
          {
            name: 'matchId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Match archived successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    matchId: { type: 'string' },
                    archivedUrl: { type: 'string' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Match not found',
          },
        },
      },
    },
    '/api/ai/on_event': {
      post: {
        tags: ['AI'],
        summary: 'Handle AI event',
        description: 'Processes an AI decision event and stores it. Requires authentication in production.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['match_id', 'event_type'],
                properties: {
                  match_id: { type: 'string' },
                  event_type: { type: 'string' },
                  player_id: { type: 'string' },
                  current_state: { type: 'object' },
                  player_hand: {
                    type: 'array',
                    items: { type: 'object' },
                  },
                  available_actions: {
                    type: 'array',
                    items: { type: 'string' },
                  },
                  event_data: { type: 'object' },
                  match_history: {
                    type: 'array',
                    items: { type: 'object' },
                  },
                },
              },
            },
          },
        },
        security: [
          {
            BearerAuth: [],
          },
        ],
        responses: {
          '200': {
            description: 'AI event processed',
            content: {
              'application/json': {
                schema: { type: 'object' },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
          },
          '503': {
            description: 'AI service not available',
          },
        },
      },
    },
    '/api/data-export/{userId}': {
      get: {
        tags: ['GDPR'],
        summary: 'Export user data',
        description: 'Exports all data for a user (GDPR compliance)',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'User data export',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    userId: { type: 'string' },
                    matches: {
                      type: 'array',
                      items: { type: 'object' },
                    },
                    disputes: {
                      type: 'array',
                      items: { type: 'object' },
                    },
                    exported_at: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'User not found',
          },
        },
      },
    },
    '/api/data/{userId}': {
      delete: {
        tags: ['GDPR'],
        summary: 'Delete user data',
        description: 'Deletes all data for a user (GDPR right to be forgotten)',
        parameters: [
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'User data deleted',
          },
          '204': {
            description: 'User data deleted (no content)',
          },
          '400': {
            description: 'Bad request',
          },
          '404': {
            description: 'User not found',
          },
        },
      },
    },
    '/api/leaderboard/{gameType}': {
      get: {
        tags: ['Leaderboard'],
        summary: 'Get leaderboard',
        description: 'Gets leaderboard for a game type. Requires off-chain indexer or Solana RPC queries. Currently returns 501 Not Implemented with implementation details.',
        parameters: [
          {
            name: 'gameType',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
            description: 'Game type (0=CLAIM, 1=Poker, 2=WordSearch, etc.)',
          },
          {
            name: 'season_id',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Season ID (defaults to current season)',
          },
          {
            name: 'limit',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 100 },
            description: 'Number of entries to return (max 1000)',
          },
        ],
        responses: {
          '200': {
            description: 'Leaderboard entries',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    game_type: { type: 'integer' },
                    season_id: { type: 'string' },
                    entries: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          rank: { type: 'integer' },
                          user_id: { type: 'string' },
                          score: { type: 'integer' },
                          wins: { type: 'integer' },
                          games_played: { type: 'integer' },
                          tier: { type: 'string' },
                          timestamp: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          '501': {
            description: 'Not implemented - requires indexer or Solana RPC',
          },
        },
      },
    },
    '/api/leaderboard/{gameType}/user/{userId}': {
      get: {
        tags: ['Leaderboard'],
        summary: 'Get user rank',
        description: 'Gets a user\'s rank and stats for a game type. Requires off-chain indexer or Solana RPC.',
        parameters: [
          {
            name: 'gameType',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'season_id',
            in: 'query',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'User rank and stats',
          },
          '501': {
            description: 'Not implemented',
          },
        },
      },
    },
    '/api/leaderboard/{gameType}/tier': {
      get: {
        tags: ['Leaderboard'],
        summary: 'Filter leaderboard by tier',
        description: 'Gets leaderboard entries filtered by tier. Requires off-chain indexer.',
        parameters: [
          {
            name: 'gameType',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
          {
            name: 'tier',
            in: 'query',
            required: true,
            schema: { type: 'string', enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'] },
          },
          {
            name: 'season_id',
            in: 'query',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Filtered leaderboard entries',
          },
          '501': {
            description: 'Not implemented',
          },
        },
      },
    },
    '/api/leaderboard/{gameType}/nearby/{userId}': {
      get: {
        tags: ['Leaderboard'],
        summary: 'Get nearby players',
        description: 'Gets players above and below a user in the leaderboard. Requires off-chain indexer.',
        parameters: [
          {
            name: 'gameType',
            in: 'path',
            required: true,
            schema: { type: 'integer' },
          },
          {
            name: 'userId',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
          {
            name: 'range',
            in: 'query',
            required: false,
            schema: { type: 'integer', default: 5 },
            description: 'Number of players above and below to return',
          },
          {
            name: 'season_id',
            in: 'query',
            required: false,
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Nearby players',
          },
          '501': {
            description: 'Not implemented',
          },
        },
      },
    },
    '/api/test/clear-all': {
      delete: {
        tags: ['Test (Development Only)'],
        summary: 'Clear all records from R2 bucket (DEVELOPMENT ONLY)',
        description: '⚠️ DANGEROUS: Deletes ALL match records, disputes, evidence, and archives from the R2 bucket. This clears all data objects but does NOT delete the bucket itself. Only available in development environment and requires explicit confirmation. Safety checks: (1) ENVIRONMENT must be "development", (2) BUCKET_NAME must be "claim-matches-test", (3) requires ?confirm=true query parameter.',
        parameters: [
          {
            name: 'confirm',
            in: 'query',
            required: true,
            schema: { type: 'string' },
            description: 'Must be set to "true" to confirm deletion. This is a safety measure.',
          },
        ],
        responses: {
          '200': {
            description: 'All records cleared successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                    bucket_name: { type: 'string' },
                    deleted_count: { type: 'integer' },
                    error_count: { type: 'integer' },
                    cleared_at: { type: 'string', format: 'date-time' },
                    warning: { type: 'string' },
                    safety_checks: {
                      type: 'object',
                      properties: {
                        environment: { type: 'string' },
                        bucket_name: { type: 'string' },
                        allowed: { type: 'boolean' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Confirmation required - must include ?confirm=true',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '403': {
            description: 'Forbidden - not in development environment or wrong bucket',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Firebase JWT token (required in production)',
      },
    },
  },
};

export function generateOpenApiJson(): string {
  return JSON.stringify(openApiSpec, null, 2);
}

export function generateSwaggerHtml(baseUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Claim Storage API Documentation</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui.css" />
  <style>
    html {
      box-sizing: border-box;
      overflow: -moz-scrollbars-vertical;
      overflow-y: scroll;
    }
    *, *:before, *:after {
      box-sizing: inherit;
    }
    body {
      margin:0;
      background: #fafafa;
    }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.10.3/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      const ui = SwaggerUIBundle({
        url: "${baseUrl}/openapi.json",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>`;
}

