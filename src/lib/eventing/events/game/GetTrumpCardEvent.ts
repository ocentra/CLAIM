import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'
import type { Card } from '@types'

export class GetTrumpCardEvent<TCard extends Card = Card> extends EventArgsBase {
  static readonly eventType = 'Game/GetTrumpCard'

  readonly deferred: OperationDeferred<TCard | null>

  constructor(
    deferred: OperationDeferred<TCard | null> = createOperationDeferred<TCard | null>()
  ) {
    super()
    this.deferred = deferred
  }
}

