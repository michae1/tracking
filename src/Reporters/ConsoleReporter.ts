import { container } from "../IoC/Container";
import { EventEmitter, eventNames } from "../EventEmitter";
const events = container.resolve<EventEmitter>("EventEmitter");

export class ConsoleReporter {
  static report = (n: string, e: any) => {
    console.log(n, e?.detail);
  };
  static init(): void {
    for (let n of eventNames) {
      events.addEventListener(n, (e) => ConsoleReporter.report(n, e));
    }
  }
}

ConsoleReporter.init();

container.register("IReporter", ConsoleReporter);
