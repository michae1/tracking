import { container } from "./IoC/Container";

import './globalLoad';

// App init
import { App } from "./App";

// application:
// load modules, config
// init API, expose cofigures/loaded methods
// autostart system events
// load queue
// process queue
// const instance = container.resolve(EventEmitter);

App.run();
console.log(App.Sensors);
