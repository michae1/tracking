import { container } from "./IoC/Container";
import { ISensor } from "./Sensors/ISensor";
import { QueueProcessor } from "./Queue";
import { EventEmitter } from "./EventEmitter";
import "./Sensors";

const rootName = ROOT_NAME || "TRACKINGSYSTEM";

if (!(window as any)[rootName]) {
  (window as any)[rootName] = {
    q: [],
  };
}

export class App {
  public static Sensors: ISensor[] = [];

  static run() {
    this.Sensors = container.resolveAll<ISensor>("ISensor");
    const events = container.resolve<EventEmitter>("EventEmitter");

    setTimeout(() => {
      events.dispatchEvent(new CustomEvent("system/load", {} as any));
    }, 1000);
  }
}
