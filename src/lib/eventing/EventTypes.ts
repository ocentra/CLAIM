import type { EventConstructor, IEventArgs } from './interfaces/IEventArgs'

/**
 * Base event type map.
 *
 * Domain packages augment this interface via declaration merging:
 *
 * ```ts
 * declare module '@lib/eventing/EventTypes' {
 *   interface EventTypeMap {
 *     'Authentication/SignInAsGuest': SignInAsGuestEvent
 *   }
 * }
 * ```
 */
export interface EventTypeMap {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [eventType: string]: any
}

export type EventType = Extract<keyof EventTypeMap, string>

export type EventArgsFor<TType extends EventType> = EventTypeMap[TType]

export type TypedEventConstructor<
  TType extends EventType,
  TArgs extends IEventArgs = EventArgsFor<TType>
> = EventConstructor<TArgs> & { readonly eventType: TType }

export type AnyEventConstructor = {
  [TType in EventType]: TypedEventConstructor<TType>
}[EventType]

