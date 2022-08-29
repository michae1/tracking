import { container } from "../IoC/Container";
import { EventEmitter, eventNames } from "../EventEmitter";
const events = container.resolve<EventEmitter>("EventEmitter");

export class SimpleRestReporter {
  static report = async (n: string, e: any) => {
    const landscape = performance
      .getEntriesByType("resource")
      .map((r) => r.name);
    await fetch("http://localhost:5000", {
      method: "POST",
      body: JSON.stringify({
        event: n,
        details: e?.detail,
        landscape: landscape,
      }),
    });
  };
  static init(): void {
    for (let n of eventNames) {
      events.addEventListener(n, (e) => SimpleRestReporter.report(n, e));
    }
  }
}

SimpleRestReporter.init();

container.register("IReporter", SimpleRestReporter);
