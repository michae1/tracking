import { injectable, injectAll, registry, container } from "tsyringe";
import { EventEmitter, eventNames } from "../EventEmitter";
const events = container.resolve(EventEmitter);

@injectable()
@registry([{ token: "IReporter", useValue: ConsoleReporter }])
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
