import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { LobbyPlayer } from '@types'

export class RegisterLocalPlayerEvent extends EventArgsBase {
  static readonly eventType = 'Game/RegisterLocalPlayer'

  readonly player: LobbyPlayer

  constructor(player: LobbyPlayer) {
    super()
    this.player = player
  }
}

