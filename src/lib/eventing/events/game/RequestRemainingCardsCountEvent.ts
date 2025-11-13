import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'

export class RequestRemainingCardsCountEvent extends EventArgsBase {
  static readonly eventType = 'Game/RequestRemainingCardsCount'

  readonly deferred: OperationDeferred<number>

  constructor(deferred: OperationDeferred<number> = createOperationDeferred<number>()) {
    super()
    this.deferred = deferred
  }
}

