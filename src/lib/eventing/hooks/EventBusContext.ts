import { createContext } from 'react'
import type { IEventBus } from '@lib/eventing/interfaces/IEventBus'

export const EventBusContext = createContext<IEventBus | null>(null)
