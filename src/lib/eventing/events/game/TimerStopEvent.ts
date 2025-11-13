import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'

export class TimerStopEvent extends EventArgsBase {
  static readonly eventType = 'Game/TimerStop'

  readonly timerId: string
  readonly deferred: OperationDeferred<boolean>

  constructor(
    timerId: string,
    deferred: OperationDeferred<boolean> = createOperationDeferred<boolean>()
  ) {
    super()
    this.timerId = timerId
    this.deferred = deferred
  }
}

