import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'

export class InitializeUIPlayersEvent<TPlayer = unknown> extends EventArgsBase {
  static readonly eventType = 'Game/InitializeUIPlayers'

  readonly players: TPlayer[]
  readonly deferred: OperationDeferred<boolean>

  constructor(
    players: TPlayer[],
    deferred: OperationDeferred<boolean> = createOperationDeferred<boolean>()
  ) {
    super()
    this.players = players
    this.deferred = deferred
  }
}

