import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'
import type { Card } from '@types'

export class RequestPlayerHandDetailEvent extends EventArgsBase {
  static readonly eventType = 'Game/RequestPlayerHandDetail'

  readonly playerId: string
  readonly deferred: OperationDeferred<Card[]>

  constructor(
    playerId: string,
    deferred: OperationDeferred<Card[]> = createOperationDeferred<Card[]>()
  ) {
    super()
    this.playerId = playerId
    this.deferred = deferred
  }
}

