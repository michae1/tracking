import { injectable, injectAll, container } from "tsyringe";
import { ISensor } from "./Sensors/ISensor";
import { LoadSensor } from "./Sensors/LoadSensor";

@injectable()
export class App {
  constructor(
    @injectAll("ISensor")
    private Sensors: ISensor[]
  ) {
    console.log("construct app", Sensors);
  }
}
