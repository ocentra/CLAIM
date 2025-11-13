// LMStudio Provider Implementation

import type { ILLMService } from '../interfaces/ILLMService'
import type { LMStudioConfig } from './types'
import { ProviderType } from './types'
import { getProviderSecret } from '@/services/providerSecretsService'

const prefix = '[LMStudioProvider]'
const LOG_GENERAL = false
const LOG_ERROR = true

export class LMStudioProvider implements ILLMService {
  private config: LMStudioConfig | null = null

  async Initialize(modelId?: string): Promise<void> {
    try {
      const baseUrl = (await getProviderSecret(ProviderType.LMSTUDIO, 'baseUrl')) || 'http://localhost:1234/v1'

      this.config = {
        type: ProviderType.LMSTUDIO,
        enabled: true,
        name: 'LM Studio',
        baseUrl,
        model: modelId || (await getProviderSecret(ProviderType.LMSTUDIO, 'model')) || undefined,
        maxTokens: 4096,
        temperature: 0.7,
      }

      // Test connection
      try {
        const healthResponse = await fetch(`${baseUrl.replace('/v1', '')}/health`, {
          method: 'GET',
        })
        if (!healthResponse.ok) {
          throw new Error('LM Studio not running or not accessible')
        }
      } catch (error) {
        throw new Error(`LM Studio connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      if (LOG_GENERAL) {
        console.log(prefix, '✅ Initialized LM Studio provider')
      }
    } catch (error) {
      if (LOG_ERROR) {
        console.error(prefix, '❌ Failed to initialize LM Studio provider:', error)
      }
      throw error
    }
  }

  async GetResponseAsync(systemMessage: string, userPrompt: string): Promise<string> {
    if (!this.config) {
      throw new Error('LM Studio provider not initialized')
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: this.config.maxTokens,
          temperature: this.config.temperature,
        }),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
        throw new Error(`LM Studio API error: ${error.error?.message || response.statusText}`)
      }

      const data = await response.json()
      return data.choices[0]?.message?.content || ''
    } catch (error) {
      if (LOG_ERROR) {
        console.error(prefix, '❌ Failed to get response from LM Studio:', error)
      }
      throw error
    }
  }

  IsReady(): boolean {
    return this.config !== null
  }

  Dispose(): void {
    this.config = null
  }
}

