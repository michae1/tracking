import { ISensor } from "./ISensor";
import { container } from "../IoC/Container";
import { EventEmitter } from "../EventEmitter";
const events = container.resolve<EventEmitter>("EventEmitter");

export class NetworkSensor implements ISensor {
  constructor() {
    console.log("created NetworkSensor");
  }
  getCallableName() {
    return null;
  }
  static init(): void {
    if (!("serviceWorker" in navigator)) {
      console.log("not supported");
      // service workers not supported
      // return;
    }
    events.addEventListener("system/load", (event) => {
          console.log("page load 22");
          if (!("serviceWorker" in navigator)) {
            // service workers not supported 😣
            return;
          }
          navigator.serviceWorker.register("worker.js").then(
            () => {
              // registered! 👍🏼
              console.log("SW registered");
              console.log("init port", navigator.serviceWorker);
            },
            (err) => {
              console.error("SW registration failed! 😱", err);
            }
          );

          const messageChannel = new MessageChannel();

          navigator.serviceWorker.addEventListener("controllerchange", (evt) => {
              console.log("controller changed");
          });
      window.addEventListener("load", () => {

        
      });
          navigator.serviceWorker.ready.then(worker => {
            console.log("ready??", navigator.serviceWorker);
                  // worker.active.postMessage(loggingdata); 
              });
          // // First we initialize the channel by sending
          // // the port to the Service Worker (this also
          // // transfers the ownership of the port)
          navigator.serviceWorker.controller.postMessage(
            {
              type: "INIT_PORT",
            },
            [messageChannel.port2]
          );

          // Listen to the response
          messageChannel.port1.onmessage = (event) => {
            // Print the result
            console.log("data", event.data);
          };
          // navigator.serviceWorker.controller.postMessage({
          //   type: "INCREASE_COUNT",
          // });
        });
  }
}

NetworkSensor.init();

container.register("Isensor", NetworkSensor);
