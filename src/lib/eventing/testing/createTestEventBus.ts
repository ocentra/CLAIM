import { EventBus, type EventBusOptions } from '../EventBus';

export const createTestEventBus = (options?: EventBusOptions): EventBus => {
  return new EventBus(options);
};

