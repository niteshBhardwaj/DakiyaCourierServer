/**
 * Originally taken from 'w3tecch/express-typescript-boilerplate'
 * Credits to the author
 */

import { EventDispatcher as EventDispatcherClass } from 'event-dispatch';
import { Constructable, Container } from 'typedi';

// Creates an EventDispatcher.
export function EventDispatcher() {
  return (target: Constructable<unknown>, propertyName: string|undefined, index: number): void => {
    const eventDispatcher = new EventDispatcherClass();
    Container.registerHandler({
      object: target,
      propertyName,
      index,
      value: () => eventDispatcher,
    });
  };
}

export { EventDispatcher as EventDispatcherInterface } from 'event-dispatch';
