import { assertImplements } from '@lib/contracts';
import { IEventArgsContract } from '@lib/eventing/contracts/specs';
import type { EventConstructor, IEventArgs } from '@lib/eventing/interfaces/IEventArgs';
import { createGuid } from '@lib/core';

export abstract class EventArgsBase implements IEventArgs {
  public readonly timestamp: number = Date.now();
  public readonly uniqueIdentifier: string = createGuid();
  public isRePublishable = false;

  private disposed = false;

  protected constructor() {
    assertImplements(this, 'IEventArgs', IEventArgsContract);

    const ctor = this.constructor as EventConstructor<IEventArgs>;
    if (!ctor.eventType || typeof ctor.eventType !== 'string') {
      throw new Error(
        `EventArgs subclass "${this.constructor.name}" must declare static readonly eventType.`
      );
    }
  }

  dispose(): void {
    if (this.disposed) {
      return;
    }

    this.disposed = true;
    this.onDispose();
  }

  protected onDispose(): void {
    // Intended for subclasses.
  }

  toString(): string {
    return `${this.constructor.name} [timestamp: ${new Date(
      this.timestamp
    ).toISOString()}, uniqueIdentifier: ${this.uniqueIdentifier}, isRePublishable: ${
      this.isRePublishable
    }]`;
  }
}

