import { EventQueueProcessor } from "../app-context/eventqueue-processor";
import { HandlerCollections } from "../app-context/handler-collections";
import { IContext } from "../app-context/icontext";
import { ILogger } from "../app-context/ilogger";
import { IWebSocketFactory } from "../app-context/iwebsocket-factory";
import { Settings } from "../app-context/settings";
import { State } from "../app-context/state";
import { TimerManager } from "../app-context/timer-manager";
import { EventQueue } from "../events/event-queue";
import { IMessageHandler } from "../handlers/imessage-handler";
import { BrowserLogger } from "./browser-logger";
import { BrowserWebSocketFactory } from "./browser-websocket-factory";

export class BrowserContext implements IContext {
    public settings: Settings;
    public logger: ILogger;
    public eventQueue: EventQueue;
    public tm: TimerManager;
    public processor: EventQueueProcessor;
    public state: State;
    public handlers: IMessageHandler[];
    public webSocketFactory: IWebSocketFactory;

    constructor() {
        this.settings = new Settings();
        this.logger = new BrowserLogger();
        this.eventQueue = new EventQueue();
        this.tm = new TimerManager();
        this.processor = new EventQueueProcessor(this);
        this.state = new State();
        this.webSocketFactory = new BrowserWebSocketFactory();
        this.handlers = [
            ...HandlerCollections.getDefaultHandlers(this),
        ];
    }

}
