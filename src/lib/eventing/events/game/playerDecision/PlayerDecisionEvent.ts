import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { PlayerDecision } from '@types'

export class PlayerDecisionEvent extends EventArgsBase {
  static readonly eventType = 'Game/PlayerDecision'

  readonly decision: PlayerDecision

  constructor(decision: PlayerDecision) {
    super()
    this.decision = decision
  }
}

