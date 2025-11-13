// Provider types and interfaces for external LLM providers

export enum ProviderType {
  LOCAL = 'local',
  OPENAI = 'openai',
  OPENROUTER = 'openrouter',
  LMSTUDIO = 'lmstudio',
  NATIVE = 'native',
  TABAGENT_SERVER = 'tabagent_server',
}

export interface ProviderConfig {
  type: ProviderType
  enabled: boolean
  name: string
  description?: string
}

export interface OpenAIConfig extends ProviderConfig {
  type: ProviderType.OPENAI
  apiKey: string
  baseUrl?: string // Default: https://api.openai.com/v1
  model?: string // Default: gpt-4o-mini
  maxTokens?: number
  temperature?: number
}

export interface OpenRouterConfig extends ProviderConfig {
  type: ProviderType.OPENROUTER
  apiKey: string
  baseUrl?: string // Default: https://openrouter.ai/api/v1
  model?: string // Default: openai/gpt-4o-mini
  maxTokens?: number
  temperature?: number
}

export interface LMStudioConfig extends ProviderConfig {
  type: ProviderType.LMSTUDIO
  baseUrl: string // Default: http://localhost:1234/v1
  model?: string
  maxTokens?: number
  temperature?: number
}

export interface NativeConfig extends ProviderConfig {
  type: ProviderType.NATIVE
  connectionType: 'http' | 'stdin' | 'native_messaging' | 'webrtc'
  baseUrl?: string
  apiKey?: string
  webrtcSignalingUrl?: string
  nativeHostId?: string
}

export interface TabAgentServerConfig extends ProviderConfig {
  type: ProviderType.TABAGENT_SERVER
  serverUrl: string
  apiKey?: string
}

export type ProviderConfigUnion =
  | OpenAIConfig
  | OpenRouterConfig
  | LMStudioConfig
  | NativeConfig
  | TabAgentServerConfig

export interface ProviderSecrets {
  userId: string
  providers: {
    [key in ProviderType]?: {
      apiKey?: string
      baseUrl?: string
      serverUrl?: string
      webrtcSignalingUrl?: string
      nativeHostId?: string
      // Other provider-specific secrets
      [key: string]: string | undefined
    }
  }
  updatedAt: number
}

