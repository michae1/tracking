import { ISensor } from "./ISensor";
import { container } from "../IoC/Container";
import { PerformanceReportEvent } from "../EventEmitter/events/PerformanceReportEvent";
import { EventEmitter } from "../EventEmitter";
const events = container.resolve<EventEmitter>('EventEmitter');


export class PerformanceSensor implements ISensor {
  constructor() {
    console.log("created loadsensor");
  }
  getCallableName() {
    return null;
  }
  static init(): void {
    setInterval(() => {
      const totalSize = window.performance?.memory?.totalJSHeapSize || 0;
      const sizeLimit = window.performance?.memory?.jsHeapSizeLimit || 512;
      const noCapacity = totalSize / sizeLimit > 0.8;
      if (noCapacity) {
        events.dispatchEvent(
          new CustomEvent<PerformanceReportEvent>("report/performance", {
            usedJSHeapSize: window.performance?.memory?.usedJSHeapSize || 0,
            hasCapacity: false,
          } as any)
        );
      }
    }, 1000);
  }
}

container.register('ISensor', PerformanceSensor);