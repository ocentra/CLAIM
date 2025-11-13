import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { GameManagerReference } from '@types'

export class NewRoundEvent<TManager extends GameManagerReference = GameManagerReference> extends EventArgsBase {
  static readonly eventType = 'Game/NewRound'

  readonly gameManager: TManager

  constructor(gameManager: TManager) {
    super()
    this.gameManager = gameManager
  }
}

