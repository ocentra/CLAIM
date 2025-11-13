// ILLMConfig.ts
// Configuration interface for LLM services
// Adapted from Unity's ILLMConfig.cs

import type { ILLMProvider } from './ILLMProvider'

/**
 * LLM Configuration interface
 */
export interface ILLMConfig {
  provider: ILLMProvider
  modelId: string
  temperature?: number
  maxTokens?: number
  topP?: number
  topK?: number
  // Add other inference parameters as needed
}

