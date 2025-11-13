import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { PlayerAction } from '@types'

export class DecisionTakenEvent extends EventArgsBase {
  static readonly eventType = 'Game/DecisionTaken'

  readonly action: PlayerAction

  constructor(action: PlayerAction) {
    super()
    this.action = action
  }
}

