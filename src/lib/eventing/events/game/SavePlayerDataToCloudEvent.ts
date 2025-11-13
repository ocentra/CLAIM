import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'
import type { AuthPlayerData } from '@types'

export class SavePlayerDataToCloudEvent extends EventArgsBase {
  static readonly eventType = 'Game/SavePlayerDataToCloud'

  readonly playerData: AuthPlayerData
  readonly deferred: OperationDeferred<boolean>

  constructor(
    playerData: AuthPlayerData,
    deferred: OperationDeferred<boolean> = createOperationDeferred<boolean>()
  ) {
    super()
    this.playerData = playerData
    this.deferred = deferred
  }
}

