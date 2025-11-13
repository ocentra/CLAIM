import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { Card } from '@types'

export class SetTrumpCardEvent<TCard extends Card = Card> extends EventArgsBase {
  static readonly eventType = 'Game/SetTrumpCard'

  readonly card: TCard | null

  constructor(card: TCard | null) {
    super()
    this.card = card
  }
}

