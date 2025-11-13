import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'
import type { Card } from '@types'

export class RequestFloorCardsDetailEvent extends EventArgsBase {
  static readonly eventType = 'Game/RequestFloorCardsDetail'

  readonly deferred: OperationDeferred<Card[]>

  constructor(deferred: OperationDeferred<Card[]> = createOperationDeferred<Card[]>()) {
    super()
    this.deferred = deferred
  }
}

