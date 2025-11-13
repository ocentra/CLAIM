import type { PlayerDecision } from '@types'
import { PlayerDecisionEvent } from './PlayerDecisionEvent'

export class PlayerDecisionUIEvent extends PlayerDecisionEvent {
  static readonly eventType = 'Game/PlayerDecision/UI'

  constructor(decision: PlayerDecision) {
    super(decision)
  }
}

