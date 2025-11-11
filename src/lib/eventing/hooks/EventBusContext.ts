import { createContext } from 'react';
import type { IEventBus } from '@lib/eventing/interfaces/IEventBus';
import { EventBus } from '@lib/eventing/EventBus';

export const EventBusContext = createContext<IEventBus | null>(null);

