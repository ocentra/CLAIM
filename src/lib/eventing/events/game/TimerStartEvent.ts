import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import { createOperationDeferred, type OperationDeferred } from '@lib/eventing'
import type { TimerOptions } from '@types'

export class TimerStartEvent extends EventArgsBase {
  static readonly eventType = 'Game/TimerStart'

  readonly timerId: string
  readonly options: TimerOptions
  readonly deferred: OperationDeferred<boolean>

  constructor(
    timerId: string,
    options: TimerOptions,
    deferred: OperationDeferred<boolean> = createOperationDeferred<boolean>()
  ) {
    super()
    this.timerId = timerId
    this.options = options
    this.deferred = deferred
  }
}

