import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'
import { ProviderType } from '@/ai/providers/types'

export class RequestProviderSwitchEvent extends EventArgsBase {
  static readonly eventType = 'Model/RequestProviderSwitch'

  readonly deferred: OperationDeferred<{ success: boolean; error?: string }>
  readonly request: {
    providerType: ProviderType
    modelId?: string
    quantPath?: string
  }

  constructor(
    request: { providerType: ProviderType; modelId?: string; quantPath?: string },
    deferred: OperationDeferred<{ success: boolean; error?: string }> = createOperationDeferred<{ success: boolean; error?: string }>()
  ) {
    super()
    this.request = request
    this.deferred = deferred
  }
}

