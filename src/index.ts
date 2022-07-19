import "@abraham/reflection";
import { container } from "tsyringe";
import { EventEmitter } from "./EventEmitter";
import "./Sensors";
// import {LoadSensor} from  './Sensors/LoadSensor';
// console.log(LoadSensor)
import { App } from "./App";
const events = container.resolve(EventEmitter);
console.log("eee", events);
// application:
// load modules, config
// init API, expose cofigures/loaded methods
// autostart system events
// load queue
// process queue
import { QueueProcessor } from "./Queue";

const rootName = ROOT_NAME || "TRACKINGSYSTEM";

if (!(window as any)[rootName]) {
  (window as any)[rootName] = {
    q: [],
  };
}
const instance = container.resolve(EventEmitter);

QueueProcessor.init();

setTimeout(() => {
  events.dispatchEvent(new CustomEvent("load", { a: 4 } as any));
}, 1000);

const v = container.resolve(App);
console.log(v);
