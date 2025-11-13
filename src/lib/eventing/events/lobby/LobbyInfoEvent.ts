import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { ButtonReference } from '@types'

export class LobbyInfoEvent extends EventArgsBase {
  static readonly eventType = 'Lobby/Info'

  readonly button: ButtonReference

  constructor(button: ButtonReference) {
    super()
    this.button = button
  }
}

