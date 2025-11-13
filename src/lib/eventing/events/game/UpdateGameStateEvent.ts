import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { GameState } from '@types'

export class UpdateGameStateEvent extends EventArgsBase {
  static readonly eventType = 'Game/UpdateGameState'

  readonly state: Partial<GameState>

  constructor(state: Partial<GameState>) {
    super()
    this.state = state
  }
}

