import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'
import type { LobbyPlayer } from '@types'

export class RequestLobbyPlayerDataEvent extends EventArgsBase {
  static readonly eventType = 'Game/RequestLobbyPlayerData'

  readonly lobbyId: string
  readonly deferred: OperationDeferred<LobbyPlayer[]>

  constructor(
    lobbyId: string,
    deferred: OperationDeferred<LobbyPlayer[]> = createOperationDeferred<LobbyPlayer[]>()
  ) {
    super()
    this.lobbyId = lobbyId
    this.deferred = deferred
  }
}

