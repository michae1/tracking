import "@abraham/reflection";
import { container } from "tsyringe";
import { EventEmitter } from "./EventEmitter";

// choose implementation:
import { ConsoleReporter } from "./Reporters/ConsoleReporter";
ConsoleReporter.init();

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
const reporter = container.resolve("IReporter");

// QueueProcessor.init();

setTimeout(() => {
  events.dispatchEvent(new CustomEvent("system/load", {} as any));
}, 1000);

const v = container.resolve(App);
console.log(v);
