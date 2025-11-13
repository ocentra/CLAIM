import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'
import type { LobbyPlayer } from '@types'

export class RequestHumanPlayersDataEvent extends EventArgsBase {
  static readonly eventType = 'Game/RequestHumanPlayersData'

  readonly deferred: OperationDeferred<LobbyPlayer[]>

  constructor(
    deferred: OperationDeferred<LobbyPlayer[]> = createOperationDeferred<LobbyPlayer[]>()
  ) {
    super()
    this.deferred = deferred
  }
}

