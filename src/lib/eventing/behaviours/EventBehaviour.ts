import { ReactBehaviour } from '@lib/react-behaviours';
import { EventBus } from '@lib/eventing/EventBus';
import type { IEventBus } from '@lib/eventing/interfaces/IEventBus';
import { EventRegistrar } from '@lib/eventing/EventRegistrar';

export interface EventBehaviourContext {
  eventBus: IEventBus;
}

export abstract class EventBehaviour extends ReactBehaviour<EventBehaviourContext> {
  protected readonly eventRegistrar: EventRegistrar;

  protected get eventBus(): IEventBus {
    return this.context?.eventBus ?? EventBus.instance;
  }

  constructor(context: EventBehaviourContext) {
    super(context);
    this.eventRegistrar = new EventRegistrar(this.eventBus);
  }

  protected override onDestroy(): void {
    this.eventRegistrar.dispose();
    super.onDestroy();
  }
}

