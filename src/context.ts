import { Settings } from "./settings";
import { Logger } from "./logger";
import { Bus } from "./events/bus";

export class Context {

    settings = new Settings();
    logger = new Logger();
    bus = new Bus();
    
}