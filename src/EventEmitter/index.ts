import { container, Lifecycle } from "tsyringe";
import { LoadReportEventName } from "./events/LoadReportEvent";
import { UserActivityReportEventName } from "./events/UserActivityReportEvent";
import { PerformanceReportEventName } from "./events/PerformanceReportEvent";
// @registry([{ token: EventEmitter, useValue: new EventTarget(), scope }])
export class EventEmitter extends EventTarget {}

const events = new EventTarget();

container.register<EventEmitter>(
  EventEmitter,
  { useValue: events }
  // { lifecycle: Lifecycle.Singleton }
);

export const eventNames = [
  UserActivityReportEventName,
  PerformanceReportEventName,
  LoadReportEventName,
];
