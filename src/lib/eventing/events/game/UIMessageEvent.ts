import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { UIMessagePayload } from '@types'

export class UIMessageEvent extends EventArgsBase {
  static readonly eventType = 'Game/UIMessage'

  readonly payload: UIMessagePayload

  constructor(payload: UIMessagePayload) {
    super()
    this.payload = payload
  }
}

