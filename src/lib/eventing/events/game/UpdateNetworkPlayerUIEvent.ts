import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { LobbyPlayer } from '@types'

export class UpdateNetworkPlayerUIEvent extends EventArgsBase {
  static readonly eventType = 'Game/UpdateNetworkPlayerUI'

  readonly players: LobbyPlayer[]

  constructor(players: LobbyPlayer[]) {
    super()
    this.players = players
  }
}

