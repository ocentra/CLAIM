import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'

export class PlayerActionStartNewGameEvent extends EventArgsBase {
  static readonly eventType = 'Game/PlayerActionStartNewGame'

  constructor() {
    super()
  }
}

