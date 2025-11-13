import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { Card } from '@types'

export class ShowAllFloorCardEvent extends EventArgsBase {
  static readonly eventType = 'Game/ShowAllFloorCard'

  readonly cards: Card[]

  constructor(cards: Card[]) {
    super()
    this.cards = cards
  }
}

