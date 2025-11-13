import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'

export interface ModelLoadRequest {
  modelId: string
  quantPath?: string
  dtype?: string
  device?: string
}

export class RequestModelLoadEvent extends EventArgsBase {
  static readonly eventType = 'Model/RequestModelLoad'

  readonly request: ModelLoadRequest
  readonly deferred: OperationDeferred<{ success: boolean; error?: string }>

  constructor(
    request: ModelLoadRequest,
    deferred: OperationDeferred<{ success: boolean; error?: string }> = createOperationDeferred<{ success: boolean; error?: string }>()
  ) {
    super()
    this.request = request
    this.deferred = deferred
  }
}

