import { EventArgsBase } from '@lib/eventing/base/EventArgsBase'
import type { ScoreManagerDetails } from '@types'

export class UpdateScoreDataEvent<TDetails extends ScoreManagerDetails = ScoreManagerDetails> extends EventArgsBase {
  static readonly eventType = 'Game/UpdateScoreData'

  readonly details: TDetails

  constructor(details: TDetails) {
    super()
    this.details = details
  }
}

