// application:
// load modules, config
// init API, expose cofigures/loaded methods
// autostart system events
// load queue
// process queue
import { QueueProcessor } from './Queue';
const rootName = ROOT_NAME || "TRACKINGSYSTEM";


if (!window[rootName]) {
  window[rootName] = {
  	q: []
  }
}

QueueProcessor.init();