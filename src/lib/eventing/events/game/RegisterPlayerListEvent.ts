import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { Player } from '@types'

export class RegisterPlayerListEvent extends EventArgsBase {
  static readonly eventType = 'Game/RegisterPlayerList'

  readonly players: Player[]

  constructor(players: Player[]) {
    super()
    this.players = players
  }
}

