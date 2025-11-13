import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred, type OperationResult } from '@lib/eventing'
import type { AuthPlayerData } from '@types'

export class GetLocalPlayerEvent extends EventArgsBase {
  static readonly eventType = 'Game/GetLocalPlayer'

  readonly deferred: OperationDeferred<OperationResult<AuthPlayerData>>

  constructor(
    deferred: OperationDeferred<OperationResult<AuthPlayerData>> = createOperationDeferred<OperationResult<AuthPlayerData>>()
  ) {
    super()
    this.deferred = deferred
  }
}

