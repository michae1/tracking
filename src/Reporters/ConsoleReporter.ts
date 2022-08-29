import { container } from "../IoC/Container";
import { EventEmitter, eventNames } from "../EventEmitter";
const events = container.resolve<EventEmitter>("EventEmitter");

export class ConsoleReporter {
  static report = (n: string, e: any) => {
    const landscape = performance
      .getEntriesByType("resource")
      .map((r) => r.name);
    console.log(n, e?.detail, landscape);
  };
  static init(): void {
    for (let n of eventNames) {
      events.addEventListener(n, (e) => ConsoleReporter.report(n, e));
    }
  }
}

ConsoleReporter.init();

container.register("IReporter", ConsoleReporter);
