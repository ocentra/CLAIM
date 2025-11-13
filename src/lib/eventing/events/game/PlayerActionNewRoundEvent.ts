import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'

export class PlayerActionNewRoundEvent extends EventArgsBase {
  static readonly eventType = 'Game/PlayerActionNewRound'

  constructor() {
    super()
  }
}

