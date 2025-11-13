import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { PlayerActionContext } from '@types'

export class PlayerActionRaiseBetEvent extends EventArgsBase {
  static readonly eventType = 'Game/PlayerActionRaiseBet'

  readonly amount: number
  readonly context?: PlayerActionContext

  constructor(amount: number, context?: PlayerActionContext) {
    super()
    this.amount = amount
    this.context = context
  }
}

