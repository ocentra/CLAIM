import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'
import type { ScoreManagerDetails } from '@types'

export class RequestScoreManagerDetailsEvent extends EventArgsBase {
  static readonly eventType = 'Game/RequestScoreManagerDetails'

  readonly deferred: OperationDeferred<ScoreManagerDetails>

  constructor(
    deferred: OperationDeferred<ScoreManagerDetails> = createOperationDeferred<ScoreManagerDetails>()
  ) {
    super()
    this.deferred = deferred
  }
}

