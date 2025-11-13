import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'
import type { AuthPlayerData } from '@types'

export class RequestPlayerDataFromCloudEvent extends EventArgsBase {
  static readonly eventType = 'Game/RequestPlayerDataFromCloud'

  readonly playerId: string
  readonly deferred: OperationDeferred<AuthPlayerData | null>

  constructor(
    playerId: string,
    deferred: OperationDeferred<AuthPlayerData | null> = createOperationDeferred<AuthPlayerData | null>()
  ) {
    super()
    this.playerId = playerId
    this.deferred = deferred
  }
}

