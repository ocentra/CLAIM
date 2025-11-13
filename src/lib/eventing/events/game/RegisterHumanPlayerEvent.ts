import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { LobbyPlayer } from '@types'

export class RegisterHumanPlayerEvent extends EventArgsBase {
  static readonly eventType = 'Game/RegisterHumanPlayer'

  readonly player: LobbyPlayer

  constructor(player: LobbyPlayer) {
    super()
    this.player = player
  }
}

