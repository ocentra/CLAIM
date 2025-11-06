import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import type { Plugin } from 'vite'

// Simple API routes for querying logs from IndexedDB
// App writes logs directly to IndexedDB, these routes only query
function logApiPlugin(): Plugin {
  return {
    name: 'log-api',
    configureServer(server) {
      // MCP HTTP endpoint: POST /mcp
      server.middlewares.use('/mcp', async (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        
        if (req.method === 'OPTIONS') {
          res.writeHead(200)
          res.end()
          return
        }
        
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk: Buffer) => {
            body += chunk.toString()
          })
          
          req.on('end', async () => {
            try {
              const request = JSON.parse(body)
              
              // Log incoming request for debugging
              console.log('[MCP] Received request:', JSON.stringify(request, null, 2))
              
              // MCP JSON-RPC 2.0 format: { jsonrpc: "2.0", id, method, params }
              const { jsonrpc, id, method } = request
              
              if (jsonrpc !== '2.0') {
                res.writeHead(400, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                  jsonrpc: '2.0',
                  id: id || null,
                  error: {
                    code: -32600,
                    message: 'Invalid Request: jsonrpc must be "2.0"',
                  },
                }))
                return
              }
              
              // Handle MCP methods
              if (method === 'initialize') {
                // MCP initialization - required first call
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                  jsonrpc: '2.0',
                  id,
                  result: {
                    protocolVersion: '2024-11-05',
                    capabilities: {
                      tools: {},
                    },
                    serverInfo: {
                      name: 'claim-logs',
                      version: '1.0.0',
                    },
                  },
                }))
                return
              }
              
              if (method === 'notifications/initialized') {
                // This is a notification (no response needed), but we should acknowledge it
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                  jsonrpc: '2.0',
                  id: id || null,
                  result: null,
                }))
                return
              }
              
              if (method === 'tools/list') {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                  jsonrpc: '2.0',
                  id,
                  result: {
                    tools: [
                      {
                        name: 'hello',
                        description: 'Say hello',
                        inputSchema: { type: 'object', properties: {} },
                      },
                    ],
                  },
                }))
                return
              }
              
              if (method === 'tools/call') {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({
                  jsonrpc: '2.0',
                  id,
                  result: { content: [{ type: 'text', text: 'Hello from MCP!' }] },
                }))
                return
              }
              
              // Unknown method
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({
                jsonrpc: '2.0',
                id,
                error: {
                  code: -32601,
                  message: `Method not found: ${method}`,
                },
              }))
            } catch (error) {
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({
                jsonrpc: '2.0',
                id: null,
                error: {
                  code: -32700,
                  message: error instanceof Error ? error.message : 'Parse error',
                },
              }))
            }
          })
        } else if (req.method === 'GET') {
          // Return MCP manifest/info
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({
            name: 'claim-logs',
            version: '1.0.0',
            description: 'MCP server for Claim app logs',
            interfaces: {
              mcp: {
                transport: 'http',
                url: 'http://localhost:3000/mcp',
              },
            },
            tools: [{ name: 'hello', description: 'Say hello' }],
          }))
        } else {
          next()
        }
      })
      
      // API route: GET /api/logs/query?level=error&source=Auth&limit=100
      server.middlewares.use('/api/logs/query', async (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        
        if (req.method === 'OPTIONS') {
          res.writeHead(200)
          res.end()
          return
        }
        
        if (req.method === 'GET') {
          // This endpoint must be called from the browser (via fetch interceptor)
          // Node.js can't access IndexedDB directly, so return an error
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({
            success: false,
            error: 'This endpoint must be called from the browser. IndexedDB is only accessible in the browser context.',
          }))
          return
        }
        
        next()
      })
      
      // API route: GET /api/logs/stats
      server.middlewares.use('/api/logs/stats', async (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        
        if (req.method === 'OPTIONS') {
          res.writeHead(200)
          res.end()
          return
        }
        
        if (req.method === 'GET') {
          // This endpoint must be called from the browser (via fetch interceptor)
          // Node.js can't access IndexedDB directly, so return an error
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({
            success: false,
            error: 'This endpoint must be called from the browser. IndexedDB is only accessible in the browser context.',
          }))
          return
        }
        
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    logApiPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './Assets'),
    },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei'],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (id.includes('three')) return 'three'
          if (id.includes('@react-three')) return 'react-three'
          if (id.includes('react') || id.includes('react-dom')) return 'vendor'
          return undefined
        },
      },
    },
  },
  server: {
    host: 'localhost',
    port: parseInt(process.env.PORT || process.env.VITE_PORT || '3000'),
    strictPort: true,
  },
})
