import { container } from "../IoC/Container";
import { EventEmitter, eventNames } from "../EventEmitter";
const events = container.resolve<EventEmitter>('EventEmitter');

export class ConsoleReporter {
  constructor() {
    console.log("created loadsensor");
  }
  static report = (n: string, e: any) => {
    console.log(n, e);
  };
  static init(): void {
    for (let n of eventNames) {
      events.addEventListener(n, (e) => ConsoleReporter.report(n, e));
    }
  }
}

container.register('IReporter', ConsoleReporter);
