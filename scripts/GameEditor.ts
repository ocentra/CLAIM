#!/usr/bin/env node

import { createServer } from 'http'
import { writeFile } from 'fs/promises'
import path from 'path'
import process from 'process'

interface SaveRequestBody {
  gameId?: string
  asset?: Record<string, unknown>
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

async function handleSave(body: SaveRequestBody) {
  const assetRecord = isObject(body.asset) ? body.asset : null
  const rawMetadata = assetRecord && isObject(assetRecord.metadata)
    ? (assetRecord.metadata as Record<string, unknown>)
    : {}
  const gameId =
    body.gameId ?? (typeof rawMetadata.gameId === 'string' ? (rawMetadata.gameId as string) : undefined)
  if (!gameId) {
    throw new Error('Missing gameId in save payload')
  }
  if (!assetRecord) {
    throw new Error('Missing asset payload')
  }

  const serializedAsset = {
    ...assetRecord,
    metadata: {
      ...rawMetadata,
      gameId,
    },
  }

  const uiPath = path.join(process.cwd(), 'public', 'GameModeConfig', `${gameId}.json`)
  await writeFile(uiPath, JSON.stringify(serializedAsset, null, 2), 'utf8')
  const schemaVersion =
    typeof rawMetadata.schemaVersion === 'number' || typeof rawMetadata.schemaVersion === 'string'
      ? rawMetadata.schemaVersion
      : 'n/a'
  console.log(
    `[dev-server] wrote GameModeConfig/${gameId}.json (schemaVersion=${schemaVersion})`,
  )
}

import type { IncomingMessage, ServerResponse } from 'http'

async function requestListener(req: IncomingMessage, res: ServerResponse<IncomingMessage>) {
  const { method, url } = req

  if (method === 'POST' && url === '/__dev/api/save-layout') {
    try {
      const chunks: Buffer[] = []
      for await (const chunk of req) {
        chunks.push(chunk)
      }
      const body = JSON.parse(Buffer.concat(chunks).toString()) as SaveRequestBody
      await handleSave(body)

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'ok' }))
    } catch (error) {
      console.error('[dev-server] failed to save layout', error)
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ status: 'error', message: (error as Error).message }))
    }
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ status: 'not-found' }))
}

async function startServer(port: number) {
  const server = createServer(requestListener)
  await new Promise<void>((resolve) => {
    server.listen(port, '127.0.0.1', resolve)
  })

  console.log(`[dev-server] listening on http://127.0.0.1:${port}/__dev/api/save-layout`)

  const shutdown = () => {
    server.close(() => {
      process.exit(0)
    })
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
}

const PORT = process.env.DEV_API_PORT ? Number.parseInt(process.env.DEV_API_PORT, 10) : 3300

startServer(PORT).catch((error) => {
  console.error('[dev-server] failed to start', error)
  process.exit(1)
})


