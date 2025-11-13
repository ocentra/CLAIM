import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { TurnStateUpdate } from '@types'

export class UpdateTurnStateEvent extends EventArgsBase {
  static readonly eventType = 'Game/UpdateTurnState'

  readonly update: TurnStateUpdate

  constructor(update: TurnStateUpdate) {
    super()
    this.update = update
  }
}

