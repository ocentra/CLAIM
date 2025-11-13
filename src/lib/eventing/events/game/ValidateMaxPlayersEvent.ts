import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'

export class ValidateMaxPlayersEvent extends EventArgsBase {
  static readonly eventType = 'Game/ValidateMaxPlayers'

  readonly maxPlayers: number
  readonly deferred: OperationDeferred<number>

  constructor(
    maxPlayers: number,
    deferred: OperationDeferred<number> = createOperationDeferred<number>()
  ) {
    super()
    this.maxPlayers = maxPlayers
    this.deferred = deferred
  }
}

