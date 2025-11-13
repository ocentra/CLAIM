import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { Card } from '@types'

export class UpdatePlayerHandDisplayEvent extends EventArgsBase {
  static readonly eventType = 'Game/UpdatePlayerHandDisplay'

  readonly playerId: string
  readonly hand: Card[]

  constructor(playerId: string, hand: Card[]) {
    super()
    this.playerId = playerId
    this.hand = hand
  }
}

