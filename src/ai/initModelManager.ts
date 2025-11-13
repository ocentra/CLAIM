// initModelManager.ts
// Early initialization module for ModelManager
// This runs immediately when imported (like TabAgent's backgroundModelManager IIFE)
// Must be imported BEFORE any transformers.js code runs

import { env } from '@huggingface/transformers'
import { PipelineDBHandler } from '@/lib/pipelines/PipelineDBHandler'
import { DeviceCapabilities } from '@/lib/pipelines/PipelineConfigs'
import { PipelineStateManager } from '@/lib/pipelines/PipelineStateManager'
import { ModelLoadProgressEvent } from '@/lib/eventing/events/model'
import { EventBus } from '@/lib/eventing/EventBus'

type OnnxBackendConfig = {
  executionProviders?: string[]
  webgpu?: {
    powerPreference?: string
  }
  logLevel?: string
}

type TransformersFetchOptions = RequestInit

const prefix = '[initModelManager]'
const LOG_INIT = true
const LOG_FETCH = false
const LOG_FETCH_INIT = true
const LOG_CHUNKED = false

// CRITICAL: Disable browser cache to force transformers.js to use our custom fetch
// This ensures ALL model file requests go through our fetch intercept
env.useBrowserCache = false

// Module-level state variables (matches TabAgent's pattern)
let currentModelRepoId: string | null = null
let currentModelQuantPath: string | null = null

// WebGPU detection
let hasWebGPU: boolean = false

/**
 * Initialize ModelManager early (before React renders)
 * This matches TabAgent's backgroundModelManager.ts initialization pattern exactly
 */
;(async () => {
  try {
    if (LOG_INIT) {
      console.log(prefix, '🚀 Initializing ModelManager (early initialization)...')
    }

    // Initialize DeviceCapabilities (detects WebGPU and FP16 support)
    await DeviceCapabilities.initialize()
    hasWebGPU = await DeviceCapabilities.hasWebGPU()

    // Configure execution providers - prefer WebGPU if available (matches TabAgent exactly)
    const transformersEnv = env
    const onnxBackend: OnnxBackendConfig =
      (transformersEnv.backends.onnx as OnnxBackendConfig | undefined) ?? {}
    transformersEnv.backends.onnx = onnxBackend as Partial<typeof env.backends.onnx>

    if (hasWebGPU) {
      onnxBackend.executionProviders = ['webgpu', 'wasm']
      if (onnxBackend.webgpu) {
        onnxBackend.webgpu.powerPreference = 'high-performance'
      }
    } else {
      onnxBackend.executionProviders = ['wasm']
    }

    onnxBackend.logLevel = 'warning'

    // Initialize PipelineStateManager
    await PipelineStateManager.initialize()

    // Setup fetch override (MUST happen before transformers.js tries to fetch)
    setupFetchOverride()

    if (LOG_INIT) {
      console.log(prefix, '✅ ModelManager early initialization complete')
    }
  } catch (error) {
    console.error(prefix, '❌ Failed to initialize ModelManager early:', error)
    // Don't throw - let the app continue, ModelManager will initialize lazily
  }
})()

/**
 * Fetch from network and cache (matches TabAgent's fetchFromNetworkAndCache)
 */
async function fetchFromNetworkAndCache(
  _input: string | Request | URL,
  resourceUrl: string
): Promise<Response> {
  const fileName = resourceUrl.split('/').pop() || 'file'

  // Send download start event
  EventBus.instance.publish(
    new ModelLoadProgressEvent({
      modelId: currentModelRepoId || '',
      progress: 0,
      status: 'initiate',
      message: `Downloading ${fileName}...`,
    })
  )

  // Use PipelineDBHandler to fetch and cache
  const response = await PipelineDBHandler.fetchAndCacheFile(
    resourceUrl,
    originalFetch.bind(self),
    {
      currentModelRepoId,
      progressCallback: ({ loaded, total, progress }) => {
        // Map progress to 0-25% range for downloads
        const downloadProgress = Math.round(progress * 0.25)

        // Send progress update every 5% or every 10MB
        if (downloadProgress % 5 === 0 || loaded % (10 * 1024 * 1024) === 0) {
          EventBus.instance.publish(
            new ModelLoadProgressEvent({
              modelId: currentModelRepoId || '',
              progress: downloadProgress,
              status: 'progress',
              loaded,
              total,
              message: `Downloading ${fileName}...`,
            })
          )
        }
      },
    }
  )

  // Send download complete event
  const contentLength = response.headers.get('Content-Length')
  const fileSize = contentLength ? parseInt(contentLength, 10) : 0

  EventBus.instance.publish(
    new ModelLoadProgressEvent({
      modelId: currentModelRepoId || '',
      progress: 25,
      status: 'done',
      loaded: fileSize,
      total: fileSize,
      message: `Downloaded ${fileName}`,
    })
  )

  return response
}

// Store original fetch before overriding
const originalFetch = self.fetch
if (LOG_FETCH_INIT) {
  const initInfo = `🔧 [Init] Setting up fetch override:
    Original fetch: ${typeof originalFetch}
    hasSelf: ${typeof self !== 'undefined'}
    hasGlobalThis: ${typeof globalThis !== 'undefined'}
    hasWindow: ${typeof window !== 'undefined'}
    selfIsSame: ${self === globalThis}
    fetchIsSame: ${self.fetch === globalThis.fetch}`
  console.log(prefix, initInfo)
}

/**
 * Setup fetch override for model file caching (matches TabAgent's customFetchHandler exactly)
 */
function setupFetchOverride(): void {
  // Override global fetch for caching (matches TabAgent's customFetchHandler exactly)
  const customFetchHandler = async function (
    input: string | Request | URL,
    options?: TransformersFetchOptions
  ): Promise<Response> {
    const { url: resourceUrl } = PipelineDBHandler.extractResourceUrl(input)

    // Log detailed fetch info if enabled
    if (LOG_FETCH) {
      const fetchInfo = `🌐 [Custom Fetch] INTERCEPTED:
        url: ${resourceUrl}
        inputType: ${typeof input}
        isString: ${typeof input === 'string'}
        isRequest: ${input instanceof Request}
        isURL: ${input instanceof URL}`
      console.log(prefix, fetchInfo)
    }

    // Early exit if no URL extracted
    if (!resourceUrl) {
      if (LOG_FETCH) console.log(prefix, `[Custom Fetch] No resourceUrl, using original fetch.`)
      return originalFetch.call(self, input, options)
    }

    // Debug: Check if this is a model file request
    if (LOG_FETCH && (resourceUrl.includes('.onnx') || resourceUrl.includes('.bin'))) {
      console.log(prefix, '🔍 [Custom Fetch] DETECTED MODEL FILE REQUEST:', resourceUrl)
    }

    // Check if we should intercept this file
    const { shouldIntercept, isHuggingFaceFile } = PipelineDBHandler.shouldInterceptFile(resourceUrl)

    if (LOG_FETCH) {
      const fileTypeCheck = `[Custom Fetch] File type check:
        resourceUrl: ${resourceUrl}
        isHuggingFaceFile: ${isHuggingFaceFile}
        shouldIntercept: ${shouldIntercept}`
      console.log(prefix, fileTypeCheck)
    }

    // If not a model file, use original fetch
    if (!shouldIntercept) {
      if (LOG_FETCH) console.log(prefix, `[Custom Fetch] Using original fetch for non-model file: ${resourceUrl}`)
      return originalFetch.call(self, input, options)
    }

    // Handle URL rewriting for HuggingFace files
    let finalResourceUrl = resourceUrl
    if (isHuggingFaceFile) {
      if (LOG_FETCH) {
        console.log(prefix, `[Custom Fetch] HuggingFace file detected:
          originalUrl: ${resourceUrl}
          currentModelRepoId: ${currentModelRepoId}
          currentModelQuantPath: ${currentModelQuantPath}`)
      }

      finalResourceUrl = await PipelineDBHandler.handleModelFileRewriting(
        resourceUrl,
        currentModelRepoId,
        currentModelQuantPath
      )

      if (LOG_FETCH && finalResourceUrl !== resourceUrl) {
        console.log(prefix, `[Custom Fetch] After handleModelFileRewriting: ${resourceUrl} -> ${finalResourceUrl}`)
      }

      // Map generic ONNX paths to specific quantized paths
      const beforeMapOnnx = finalResourceUrl
      finalResourceUrl = PipelineDBHandler.mapOnnxModelPath(finalResourceUrl, currentModelQuantPath)

      if (LOG_FETCH && finalResourceUrl !== beforeMapOnnx) {
        console.log(prefix, `[Custom Fetch] After mapOnnxModelPath: ${beforeMapOnnx} -> ${finalResourceUrl}`)
      }

      if (LOG_FETCH && finalResourceUrl !== resourceUrl) {
        console.log(prefix, `[Custom Fetch] ✅ Final URL rewrite: ${resourceUrl} -> ${finalResourceUrl}`)
      }

      // Handle generation_config.json fallback
      if (finalResourceUrl.endsWith('generation_config.json') && finalResourceUrl !== resourceUrl) {
        const configFiles = ['generation_config.json', 'genai_config.json', 'config.json']
        const fileName = finalResourceUrl.split('/').pop() || ''
        if (!configFiles.includes(fileName)) {
          if (LOG_FETCH) console.log(prefix, `[Custom Fetch] Creating empty generation config for: ${fileName}`)
          return PipelineDBHandler.createEmptyGenerationConfig()
        }
      }
    }

    // Try to serve from IndexedDB cache
    if (LOG_FETCH) {
      const fileName = finalResourceUrl.split('/').pop() || 'unknown'
      console.log(prefix, `[Custom Fetch] 🔍 Checking IndexedDB cache:
        file: ${fileName}
        url: ${finalResourceUrl}
        modelId: ${currentModelRepoId}`)
    }

    const cachedResponse = await PipelineDBHandler.tryServeFromIndexedDB(
      finalResourceUrl,
      currentModelRepoId,
      LOG_CHUNKED
    )

    if (cachedResponse) {
      const fileSize = cachedResponse.headers.get('Content-Length')
      const fileSizeBytes = fileSize ? parseInt(fileSize) : 0
      const fileName = finalResourceUrl.split('/').pop() || 'unknown'
      if (LOG_FETCH)
        console.log(
          prefix,
          `[Custom Fetch] ✅ CACHE HIT - Serving from IndexedDB: ${fileName} (${(fileSizeBytes / 1024 / 1024).toFixed(1)}MB)`
        )

      // Send cache hit progress message - use CACHED status to distinguish from downloads
      EventBus.instance.publish(
        new ModelLoadProgressEvent({
          modelId: currentModelRepoId || '',
          progress: 25, // Same as download complete
          status: 'done', // Use 'done' for cached files
          loaded: fileSizeBytes,
          total: fileSizeBytes,
          message: `Loaded ${fileName} from cache`,
        })
      )

      return cachedResponse
    }

    // Cache miss - download and cache
    if (LOG_FETCH) {
      const fileName = finalResourceUrl.split('/').pop() || 'unknown'
      console.log(prefix, `[Custom Fetch] ❌ CACHE MISS - Will download: ${fileName}
        url: ${finalResourceUrl}`)
    }
    return await fetchFromNetworkAndCache(input, finalResourceUrl)
  }

  // Apply fetch override to all global contexts (matches TabAgent exactly)
  self.fetch = customFetchHandler
  globalThis.fetch = customFetchHandler
  if (typeof window !== 'undefined') {
    window.fetch = customFetchHandler as typeof window.fetch
  }

  if (LOG_FETCH_INIT) {
    const verificationInfo = `✅ [Init] Fetch override applied to all global contexts:
      selfFetchOverridden: ${self.fetch === customFetchHandler}
      globalThisFetchOverridden: ${globalThis.fetch === customFetchHandler}`
    console.log(prefix, verificationInfo)
  }
}

/**
 * Update current model state (called by ModelManager when loading models)
 */
export function updateModelState(repoId: string | null, quantPath: string | null): void {
  currentModelRepoId = repoId
  currentModelQuantPath = quantPath
}

// Export ModelManager for use elsewhere
export { ModelManager } from './ModelManager'

