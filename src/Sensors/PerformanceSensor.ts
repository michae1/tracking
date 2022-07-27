import { ISensor } from "./ISensor";
import { container } from "../IoC/Container";
import { PerformanceReportEvent } from "../EventEmitter/events/PerformanceReportEvent";
import { EventEmitter } from "../EventEmitter";
const events = container.resolve<EventEmitter>("EventEmitter");

class CPUKind {
  currentRatio = 0;
  lastUpdated = Date.now();
  checkLoad = (expected: number) => {
    if (document.hasFocus()) {
      const load = performance.now() - expected;
      console.log("shift:", load);
      if (load < 1) {
        this.currentRatio = 1;
      }
      if (load > 1 && load < 100) {
        this.currentRatio = 20;
      }
      if (load > 100 && load < 700) {
        this.currentRatio = 50;
      }
      if (load > 700 && load < 3000) {
        this.currentRatio = 80;
      }
      if (load > 3000) {
        this.currentRatio = 100;
      }
    }
  };
  measure() {
    setTimeout(this.checkLoad, 100, performance.now() + 100);
  }
}

export class PerformanceSensor implements ISensor {
  static cpu: CPUKind = new CPUKind();
  getCallableName() {
    return null;
  }
  static init = () => {
    this.cpu.measure();
    // setInterval(()=>{
    //   let a = 1;
    //   for (let i = 1; i<100000000;i++){
    //     a = a + i/i*i;
    //   }
    //   console.log('done', a)
    // }, 450)
    setInterval(() => {
      this.cpu.measure();
      const totalSize = window.performance?.memory?.totalJSHeapSize || 0;
      const sizeLimit = window.performance?.memory?.jsHeapSizeLimit || 512;
      const noCapacity = totalSize / sizeLimit > 0.8;
      if (noCapacity) {
        events.dispatchEvent(
          new CustomEvent<PerformanceReportEvent>("report/performance", {
            usedJSHeapSize: window.performance?.memory?.usedJSHeapSize || 0,
            hasCapacity: false,
            cpu: this.cpu.currentRatio,
          } as any)
        );
      } else {
        events.dispatchEvent(
          new CustomEvent<PerformanceReportEvent>("report/performance", {
            detail: {
              usedJSHeapSize: window.performance?.memory?.usedJSHeapSize || 0,
              hasCapacity: true,
              cpu: this.cpu.currentRatio,
            } as any,
          })
        );
      }
    }, 5000);
  };
}

container.register("ISensor", PerformanceSensor);
