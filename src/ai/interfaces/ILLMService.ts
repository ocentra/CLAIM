// ILLMService.ts
// Service interface for LLM providers
// Adapted from Unity's ILLMService.cs

/**
 * LLM Service interface
 * Defines the contract for LLM service implementations
 */
export type ILLMService = {
  /**
   * Get response from LLM asynchronously
   * @param systemMessage - System prompt/instructions
   * @param userPrompt - User prompt/query
   * @returns Promise resolving to the generated text response
   */
  GetResponseAsync(systemMessage: string, userPrompt: string): Promise<string>

  /**
   * Check if the service is ready/initialized
   */
  IsReady(): boolean

  /**
   * Initialize the service
   */
  Initialize(modelId?: string, quantPath?: string): Promise<void>

  /**
   * Dispose/cleanup the service
   */
  Dispose(): void
};

