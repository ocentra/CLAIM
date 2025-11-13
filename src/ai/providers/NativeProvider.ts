// Native Provider Implementation (WebRTC/stdin/native messaging)

import type { ILLMService } from '../interfaces/ILLMService'
import type { NativeConfig } from './types'
import { ProviderType } from './types'
import { getProviderSecret } from '@/services/providerSecretsService'

const prefix = '[NativeProvider]'
const LOG_GENERAL = false
const LOG_ERROR = true

type HttpResponse = {
  choices?: Array<{
    message?: { content?: string }
    text?: string
  }>
  id?: string
  model?: string
}

export class NativeProvider implements ILLMService {
  private config: NativeConfig | null = null

  async Initialize(modelId?: string, quantPath?: string): Promise<void> {
    try {
      const connectionType = ((await getProviderSecret(ProviderType.NATIVE, 'connectionType')) ||
        'http') as NativeConfig['connectionType']

      const baseUrl = await getProviderSecret(ProviderType.NATIVE, 'baseUrl')

      this.config = {
        type: ProviderType.NATIVE,
        enabled: true,
        name: 'Native App',
        connectionType,
        baseUrl: baseUrl ?? 'http://localhost:8080',
        webrtcSignalingUrl: (await getProviderSecret(ProviderType.NATIVE, 'webrtcSignalingUrl')) ?? undefined,
        nativeHostId: (await getProviderSecret(ProviderType.NATIVE, 'nativeHostId')) ?? undefined,
      }

      switch (connectionType) {
        case 'http':
          if (modelId) {
            await this.loadModelHttp(modelId, quantPath)
          }
          break
        case 'stdin':
          throw new Error('stdin connection is not yet implemented in the web client')
        case 'native_messaging':
          throw new Error('Native messaging requires extension context, not supported in web client')
        case 'webrtc':
          throw new Error('WebRTC bridge not implemented yet')
        default:
          throw new Error(`Unsupported native connection type: ${connectionType}`)
      }

      if (LOG_GENERAL) {
        console.log(prefix, '✅ Initialized Native provider', this.config)
      }
    } catch (error) {
      if (LOG_ERROR) {
        console.error(prefix, '❌ Failed to initialize Native provider:', error)
      }
      throw error
    }
  }

  private getHttpBaseUrl(): string {
    if (!this.config?.baseUrl) {
      throw new Error('Native HTTP base URL not configured')
    }
    return this.config.baseUrl.replace(/\/$/, '')
  }

  private async loadModelHttp(modelId: string, quantPath?: string | null): Promise<void> {
    const baseUrl = this.getHttpBaseUrl()
    const payload: Record<string, unknown> = {
      model_id: modelId,
    }
    const variant = this.extractVariantFromQuant(quantPath)
    if (variant) {
      payload.variant = variant
    }

    const response = await fetch(`${baseUrl}/v1/models/load`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText)
      throw new Error(`Failed to load model via native server: ${response.status} ${errorText}`)
    }
  }

  private extractVariantFromQuant(quantPath?: string | null): string | undefined {
    if (!quantPath) {
      return undefined
    }

    const parts = quantPath.split('/')
    const last = parts[parts.length - 1] || ''
    const match = last.match(/model[_-]([a-z0-9]+)\.onnx/i)
    if (match) {
      return match[1]
    }

    if (last.endsWith('.onnx')) {
      return last.replace('.onnx', '')
    }

    return undefined
  }

  async GetResponseAsync(systemMessage: string, userPrompt: string): Promise<string> {
    if (!this.config) {
      throw new Error('Native provider not initialized')
    }

    if (this.config.connectionType !== 'http') {
      throw new Error(`Connection type ${this.config.connectionType} not implemented in web client`)
    }

    try {
      const messages = []
      if (systemMessage.trim().length > 0) {
        messages.push({ role: 'system', content: systemMessage })
      }
      messages.push({ role: 'user', content: userPrompt })

      const payload = {
        model: (await getProviderSecret(ProviderType.NATIVE, 'model')) || 'tabagent-default',
        messages,
        temperature: undefined,
        stream: false,
      }

      const baseUrl = this.getHttpBaseUrl()
      const response = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => response.statusText)
        throw new Error(`Native server error: ${response.status} ${errorText}`)
      }

      const data = (await response.json()) as HttpResponse
      const text =
        data.choices?.[0]?.message?.content ??
        data.choices?.[0]?.text ??
        ''

      return text
    } catch (error) {
      if (LOG_ERROR) {
        console.error(prefix, '❌ Failed to get response from Native provider:', error)
      }
      throw error instanceof Error ? error : new Error('Unknown native provider error')
    }
  }

  IsReady(): boolean {
    return this.config !== null
  }

  Dispose(): void {
    this.config = null
  }
}
