import { container, Lifecycle } from "tsyringe";

// @registry([{ token: EventEmitter, useValue: new EventTarget(), scope }])
export class EventEmitter extends EventTarget {}

console.log("lets create");
const events = new EventTarget();
// container.registerSingleton('EventEmitter', {useValue: EventEmitter});
container.register<EventEmitter>(
  EventEmitter,
  { useValue: events }
  // { lifecycle: Lifecycle.Singleton }
);
