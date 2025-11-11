/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IEventArgs {
  /**
   * UTC timestamp in milliseconds.
   */
  readonly timestamp: number;

  /**
   * Unique identifier for the event instance (GUID).
   */
  readonly uniqueIdentifier: string;

  /**
   * When true, the event can be published repeatedly without being filtered.
   */
  isRePublishable: boolean;

  /**
   * Dispose any resource held by the event args.
   */
  dispose(): void;
}

export interface EventTypeDescriptor {
  readonly eventType: string;
}

export type EventConstructor<T extends IEventArgs> = {
  new (...args: any[]): T;
} & EventTypeDescriptor;

