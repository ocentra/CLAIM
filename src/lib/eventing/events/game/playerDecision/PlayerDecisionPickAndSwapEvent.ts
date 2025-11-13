import type { PlayerDecision } from '@types'
import { PlayerDecisionEvent } from './PlayerDecisionEvent'

export class PlayerDecisionPickAndSwapEvent extends PlayerDecisionEvent {
  static readonly eventType = 'Game/PlayerDecision/PickAndSwap'

  constructor(decision: PlayerDecision) {
    super(decision)
  }
}

