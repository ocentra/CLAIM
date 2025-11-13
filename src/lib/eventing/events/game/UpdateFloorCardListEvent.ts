import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { Card } from '@types'

export class UpdateFloorCardListEvent<TCard extends Card = Card> extends EventArgsBase {
  static readonly eventType = 'Game/UpdateFloorCardList'

  readonly cards: TCard[]

  constructor(cards: TCard[]) {
    super()
    this.cards = cards
  }
}

