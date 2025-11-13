import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { GameManagerReference } from '@types'

export class StartTurnManagerEvent extends EventArgsBase {
  static readonly eventType = 'Game/StartTurnManager'

  readonly managerRef?: GameManagerReference

  constructor(managerRef?: GameManagerReference) {
    super()
    this.managerRef = managerRef
  }
}

