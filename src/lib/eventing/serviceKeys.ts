import { createServiceKey, type ServiceContainer } from '@lib/core'
import type { IEventBus } from './interfaces/IEventBus'
import { EventBus } from './EventBus'

export const EVENT_BUS = createServiceKey<IEventBus>('EventBus')

export const registerEventingServices = (container: ServiceContainer): void => {
  if (!container.has(EVENT_BUS)) {
    container.registerInstance(EVENT_BUS, EventBus.instance)
  }
}

