import { IContext } from "../app-context/icontext";
import { Settings } from "../app-context/settings";
import { ILogger } from "../app-context/ilogger";
import { EventQueue } from "../events/event-queue";
import { TimerManager } from "../app-context/timer-manager";
import { EventQueueProcessor } from "../app-context/eventqueue-processor";
import { State } from "../app-context/state";
import { IMessageHandler } from "../handlers/imessage-handler";
import { BrowserLogger } from "./browser-logger";
import { HandlerCollections } from "../app-context/handler-collections";

export class BrowserContext implements IContext {
    settings: Settings;    
    logger: ILogger;
    eventQueue: EventQueue;
    tm: TimerManager;
    processor: EventQueueProcessor;
    state: State;
    handlers: IMessageHandler[];

    constructor() {
        this.settings = new Settings();
        this.logger = new BrowserLogger();
        this.eventQueue = new EventQueue();
        this.tm = new TimerManager();
        this.processor = new EventQueueProcessor(this);
        this.state = new State();
        this.handlers = [
            ...HandlerCollections.getDefaultHandlers(this),
        ];
    }
    
}