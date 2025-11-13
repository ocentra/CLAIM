import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { AuthPlayerData } from '@types'

export class AuthenticationSignOutEvent extends EventArgsBase {
  static readonly eventType = 'Game/AuthenticationSignOut'

  readonly playerData: AuthPlayerData

  constructor(playerData: AuthPlayerData) {
    super()
    this.playerData = playerData
  }
}

