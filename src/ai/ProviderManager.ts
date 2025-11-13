// ProviderManager.ts
// Manages switching between different LLM providers

import type { ILLMService } from './interfaces/ILLMService'
import { LocalLLMService } from './LocalLLMService'
import { ProviderType } from './providers/types'
import { OpenAIProvider } from './providers/OpenAIProvider'
import { OpenRouterProvider } from './providers/OpenRouterProvider'
import { LMStudioProvider } from './providers/LMStudioProvider'
import { NativeProvider } from './providers/NativeProvider'

const prefix = '[ProviderManager]'
const LOG_GENERAL = false
const LOG_ERROR = true

export class ProviderManager {
  private static instance: ProviderManager | null = null
  private currentProvider: ILLMService | null = null
  private currentProviderType: ProviderType = ProviderType.LOCAL

  private constructor() {}

  static getInstance(): ProviderManager {
    if (!ProviderManager.instance) {
      ProviderManager.instance = new ProviderManager()
    }
    return ProviderManager.instance
  }

  /**
   * Switch to a different provider
   */
  async switchProvider(
    providerType: ProviderType,
    modelId?: string,
    quantPath?: string
  ): Promise<void> {
    try {
      // Dispose current provider
      if (this.currentProvider) {
        this.currentProvider.Dispose()
      }

      // Create new provider
      let provider: ILLMService

      switch (providerType) {
        case ProviderType.LOCAL:
          provider = new LocalLLMService()
          break
        case ProviderType.OPENAI:
          provider = new OpenAIProvider()
          break
        case ProviderType.OPENROUTER:
          provider = new OpenRouterProvider()
          break
        case ProviderType.LMSTUDIO:
          provider = new LMStudioProvider()
          break
        case ProviderType.NATIVE:
          provider = new NativeProvider()
          break
        default:
          throw new Error(`Unknown provider type: ${providerType}`)
      }

      // Initialize provider
      await provider.Initialize(modelId, quantPath)

      this.currentProvider = provider
      this.currentProviderType = providerType

      if (LOG_GENERAL) {
        console.log(prefix, `✅ Switched to provider: ${providerType}`)
      }
    } catch (error) {
      if (LOG_ERROR) {
        console.error(prefix, `❌ Failed to switch provider to ${providerType}:`, error)
      }
      throw error
    }
  }

  /**
   * Get current provider
   */
  getCurrentProvider(): ILLMService | null {
    return this.currentProvider
  }

  /**
   * Get current provider type
   */
  getCurrentProviderType(): ProviderType {
    return this.currentProviderType
  }

  /**
   * Check if provider is ready
   */
  isProviderReady(): boolean {
    return this.currentProvider?.IsReady() ?? false
  }
}

