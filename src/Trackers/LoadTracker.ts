import { ITracker } from "./ITracker";
import { container, registry } from "tsyringe";
import { EventEmitter } from "../EventEmitter";
const events = container.resolve(EventEmitter);

export class LoadTracker implements ITracker {
  getCallableName() {
    return null;
  }
  static init(): void {
    console.log("wait for load");
    events.addEventListener("load", () => {
      console.log("loaded");
    });
    //subscribe on events
  }
}
