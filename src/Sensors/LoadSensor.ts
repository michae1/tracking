import { ISensor } from "./ISensor";
import { injectable, injectAll, registry, container } from "tsyringe";
import { EventEmitter } from "../EventEmitter";
const events = container.resolve(EventEmitter);

console.log("hi");

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
    events.addEventListener("load", () => {
      console.error("loaded");
    });
    //subscribe on events
  }
}
