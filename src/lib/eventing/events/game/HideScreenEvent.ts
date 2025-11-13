import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'

export class HideScreenEvent extends EventArgsBase {
  static readonly eventType = 'Game/HideScreen'

  readonly screen: string

  constructor(screen: string) {
    super()
    this.screen = screen
  }
}

