import { ISensor } from "./ISensor";
import { container } from "../IoC/Container";
import { LoadReportEvent } from "../EventEmitter/events/LoadReportEvent";
import { EventEmitter } from "../EventEmitter";
const events = container.resolve<EventEmitter>("EventEmitter");

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
        new CustomEvent("report/load", {
          detail: { time: loadTime } as any,
        })
      );
    });
  }
}

LoadSensor.init();

container.register("Isensor", LoadSensor);
