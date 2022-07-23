import { container } from "../IoC/Container";
import { LoadReportEventName } from "./events/LoadReportEvent";
import { UserActivityReportEventName } from "./events/UserActivityReportEvent";
import { PerformanceReportEventName } from "./events/PerformanceReportEvent";
// @registry([{ token: EventEmitter, useValue: new EventTarget(), scope }])
export class EventEmitter extends EventTarget {}

const events = new EventTarget();

container.register(
  'EventEmitter',
  events
);

export const eventNames = [
  UserActivityReportEventName,
  PerformanceReportEventName,
  LoadReportEventName,
];
