import type { PlayerDecision } from '@types'
import { PlayerDecisionEvent } from './PlayerDecisionEvent'

export class PlayerDecisionRaiseBetEvent extends PlayerDecisionEvent {
  static readonly eventType = 'Game/PlayerDecision/RaiseBet'

  constructor(decision: PlayerDecision) {
    super(decision)
  }
}

