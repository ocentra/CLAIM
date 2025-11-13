import type { PlayerDecision } from '@types'
import { PlayerDecisionEvent } from './PlayerDecisionEvent'

export class PlayerDecisionWildcardEvent extends PlayerDecisionEvent {
  static readonly eventType = 'Game/PlayerDecision/Wildcard'

  constructor(decision: PlayerDecision) {
    super(decision)
  }
}

