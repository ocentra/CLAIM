import { globalServiceContainer } from '@lib/core';
import { registerEventingServices } from './serviceKeys';

registerEventingServices(globalServiceContainer);

export * from './EventBus';
export * from './EventRegistrar';
export * from './OperationResult';
export * from './createEventRegistrar';
export * from './interfaces/IEventArgs';
export * from './interfaces/IEventBus';
export * from './interfaces/IEventHandler';
export * from './interfaces/IEventRegistrar';
export * from './events';
export * from './behaviours';
export * from './hooks';
export * from './eventLogger';
export * from './EventTypes';
export {
  createDeferred,
  createOperationDeferred,
  type Deferred,
  type OperationDeferred,
} from './internal';
export * from './serviceKeys';

