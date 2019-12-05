import { Settings } from "../app-context/settings";
import { ILogger } from "../app-context/ilogger";
import { EventQueue } from "../events/event-queue";
import { Logger } from "./logger";
import { ChatLogger } from "../handlers/chat-logger";
import { TimerManager } from "../app-context/timer-manager";
import { IMessageHandler } from "../handlers/imessage-handler";
import { EventQueueProcessor } from "../app-context/eventqueue-processor";
import { State } from "../app-context/state";
import { HandlerCollections } from "../app-context/handler-collections";
import { IContext } from "../app-context/icontext";

export class NodeContext implements IContext {

    settings = new Settings();
    logger: ILogger = new Logger(this.settings); 
    eventQueue = new EventQueue();
    tm = new TimerManager();
    processor = new EventQueueProcessor(this);
    state = new State();
    handlers: IMessageHandler[];

    constructor() {
        this.handlers = [ 
            ...HandlerCollections.getDefaultHandlers(this), 
            new ChatLogger(this)
        ];
    }

}