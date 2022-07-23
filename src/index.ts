import { container } from "./IoC/Container";


// choose implementation, TODO MOVE TO DYNAMICALLY GENERATED FILE
import { EventEmitter } from "./EventEmitter";

import { ConsoleReporter } from "./Reporters/ConsoleReporter";
ConsoleReporter.init();



// App init
import { App } from "./App";



// application:
// load modules, config
// init API, expose cofigures/loaded methods
// autostart system events
// load queue
// process queue
// const instance = container.resolve(EventEmitter);


App.run()
console.log(App.Sensors);
