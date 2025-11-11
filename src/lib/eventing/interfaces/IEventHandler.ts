import type { IEventRegistrar } from './IEventRegistrar';

export interface IEventHandler {
  eventRegistrar: IEventRegistrar;
  subscribeToEvents(): void;
  unsubscribeFromEvents(): void;
}

