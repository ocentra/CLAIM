import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'
import type { AvailableModel } from './ModelAvailableEvent'

export class RequestModelListEvent extends EventArgsBase {
  static readonly eventType = 'Model/RequestModelList'

  readonly deferred: OperationDeferred<AvailableModel[]>

  constructor(
    deferred: OperationDeferred<AvailableModel[]> = createOperationDeferred<AvailableModel[]>()
  ) {
    super()
    this.deferred = deferred
  }
}

