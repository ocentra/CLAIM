import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'

export interface ModelGenerateRequest {
  systemMessage: string
  userPrompt: string
  modelId?: string
  inferenceSettings?: Record<string, unknown>
}

export class RequestModelGenerateEvent extends EventArgsBase {
  static readonly eventType = 'Model/RequestModelGenerate'

  readonly request: ModelGenerateRequest
  readonly deferred: OperationDeferred<{ text: string; error?: string }>

  constructor(
    request: ModelGenerateRequest,
    deferred: OperationDeferred<{ text: string; error?: string }> = createOperationDeferred<{ text: string; error?: string }>()
  ) {
    super()
    this.request = request
    this.deferred = deferred
  }
}

