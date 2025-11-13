import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'
import type { LobbyPlayer } from '@types'

export class RequestAllPlayersDataEvent extends EventArgsBase {
  static readonly eventType = 'Game/RequestAllPlayersData'

  readonly deferred: OperationDeferred<LobbyPlayer[]>

  constructor(
    deferred: OperationDeferred<LobbyPlayer[]> = createOperationDeferred<LobbyPlayer[]>()
  ) {
    super()
    this.deferred = deferred
  }
}

