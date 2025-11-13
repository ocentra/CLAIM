import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { WildCardUpdate } from '@types'

export class UpdateWildCardsEvent extends EventArgsBase {
  static readonly eventType = 'Game/UpdateWildCards'

  readonly updates: WildCardUpdate[]

  constructor(updates: WildCardUpdate[]) {
    super()
    this.updates = updates
  }
}

