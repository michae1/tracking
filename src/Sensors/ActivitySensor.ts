import { ISensor } from "./ISensor";
import { injectable, injectAll, registry, container } from "tsyringe";
import { EventEmitter } from "../EventEmitter";
const events = container.resolve(EventEmitter);

// Params:
// timeToActive

@injectable()
@registry([{ token: "ISensor", useValue: ActivitySensor }])
export class ActivitySensor implements ISensor {
  static lastActive: number;
  getCallableName() {
    return null;
  }
  static resetTimer = () => {
    ActivitySensor.lastActive = Date.now();
  };
  static init(): void {
    setInterval(() => {
      console.log(this.lastActive);
      if (!this.lastActive || Date.now() - this.lastActive > 1000) {
        console.log("inactive");
      } else {
        console.log("active");
      }
    }, 1000);
    document.addEventListener("mousemove", ActivitySensor.resetTimer, false);
  }
}
