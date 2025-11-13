// ILLMProvider.ts
// Provider enum for LLM services
// Adapted from Unity's ILLMProvider.cs

/**
 * LLM Provider types
 */
export const ILLMProvider = {
  LocalLLM: 'LocalLLM',
  OpenAI: 'OpenAI',
  OpenRouter: 'OpenRouter',
  LMStudio: 'LMStudio',
  Native: 'Native',
  TabAgentServer: 'TabAgentServer',
} as const

export type ILLMProvider = typeof ILLMProvider[keyof typeof ILLMProvider]

