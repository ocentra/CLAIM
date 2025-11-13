import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { Player } from '@types'

export class ComputerPlayerTurnEvent extends EventArgsBase {
  static readonly eventType = 'Game/PlayerDecision/ComputerPlayerTurn'

  readonly currentPlayer: Player
  readonly currentBet: number

  constructor(currentPlayer: Player, currentBet: number) {
    super()
    this.currentPlayer = currentPlayer
    this.currentBet = currentBet
  }
}

