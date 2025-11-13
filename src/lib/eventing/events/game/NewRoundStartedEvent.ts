import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'

export class NewRoundStartedEvent extends EventArgsBase {
  static readonly eventType = 'Game/NewRoundStarted'

  readonly isNewGame: boolean

  constructor(isNewGame: boolean) {
    super()
    this.isNewGame = isNewGame
  }
}

