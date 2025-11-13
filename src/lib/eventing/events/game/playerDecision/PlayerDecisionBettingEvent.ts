import type { PlayerDecision } from '@types'
import { PlayerDecisionEvent } from './PlayerDecisionEvent'

export class PlayerDecisionBettingEvent extends PlayerDecisionEvent {
  static readonly eventType = 'Game/PlayerDecision/Betting'

  constructor(decision: PlayerDecision) {
    super(decision)
  }
}

