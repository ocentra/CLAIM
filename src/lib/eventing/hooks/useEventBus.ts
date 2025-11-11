import { useContext } from 'react';
import type { IEventBus } from '@lib/eventing/interfaces/IEventBus';
import { EventBus } from '@lib/eventing/EventBus';
import { EventBusContext } from './EventBusContext';

export const useEventBus = (): IEventBus => {
  const bus = useContext(EventBusContext);
  return bus ?? EventBus.instance;
};

