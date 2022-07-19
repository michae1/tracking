import { ISensor } from "./ISensor";
import { LoadReportEvent } from "../EventEmitter/events/LoadReportEvent";
import { injectable, injectAll, registry, container } from "tsyringe";
import { EventEmitter } from "../EventEmitter";
const events = container.resolve(EventEmitter);

@injectable()
@registry([{ token: "ISensor", useValue: LoadSensor }])
export class LoadSensor implements ISensor {
  constructor() {
    console.log("created loadsensor");
  }
  getCallableName() {
    return null;
  }
  static init(): void {
    console.log("wait for load");
    events.addEventListener("system/load", (event) => {
      const loadTime =
        window.performance.timing.domContentLoadedEventEnd -
        window.performance.timing.navigationStart;
      console.log("system/loaded", loadTime);
      events.dispatchEvent(
        new CustomEvent("report/load", { time: loadTime } as any)
      );
    });
  }
}
