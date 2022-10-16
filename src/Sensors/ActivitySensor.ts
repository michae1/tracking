import { ISensor } from "./ISensor";
import { container } from "../IoC/Container";
import { EventEmitter } from "../EventEmitter";
import { UserActivityReportEvent } from "../EventEmitter/events/UserActivityReportEvent";
const events = container.resolve<EventEmitter>("EventEmitter");

// Params:
// timeToActive

export class ActivitySensor implements ISensor {
  static lastActive: number = 0;
  static activeTimes: number = 0;
  getCallableName() {
    return null;
  }
  static resetTimer = () => {
    ActivitySensor.lastActive = Date.now();
  };
  static runCheck = () => {
    setTimeout(() => {
      if (
        !ActivitySensor.lastActive ||
        Date.now() - ActivitySensor.lastActive > 1000
      ) {
        ActivitySensor.activeTimes -= 1;
        console.log("inactive");
      } else {
        ActivitySensor.activeTimes += 1;
        console.log("active");
      }
      if (ActivitySensor.activeTimes > 5 || ActivitySensor.activeTimes < -5) {
        events.dispatchEvent(
          new CustomEvent("report/userActivity", {
            detail: {
              activityLevel: ActivitySensor.activeTimes,
            } as any,
          })
        );
      } else {
        ActivitySensor.runCheck();
      }
    }, 1000);
  };
  static init(): void {
    document.addEventListener("mousemove", ActivitySensor.resetTimer, false);
    ActivitySensor.runCheck();
  }
}

ActivitySensor.init();

container.register("ISensor", ActivitySensor);
