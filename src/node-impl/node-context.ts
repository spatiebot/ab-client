import { EventQueueProcessor } from "../app-context/eventqueue-processor";
import { HandlerCollections } from "../app-context/handler-collections";
import { IContext } from "../app-context/icontext";
import { ILogger } from "../app-context/ilogger";
import { IWebSocketFactory } from "../app-context/iwebsocket-factory";
import { Settings } from "../app-context/settings";
import { State } from "../app-context/state";
import { TimerManager } from "../app-context/timer-manager";
import { EventQueue } from "../events/event-queue";
import { ChatLogger } from "../handlers/chat-logger";
import { IMessageHandler } from "../handlers/imessage-handler";
import { Logger } from "./logger";
import { NodeWebSocketFactory } from "./node-websocket-factory";

export class NodeContext implements IContext {

    public settings = new Settings();
    public logger: ILogger = new Logger(this.settings);
    public eventQueue = new EventQueue();
    public tm = new TimerManager();
    public processor = new EventQueueProcessor(this);
    public state = new State();
    public handlers: IMessageHandler[];
    public webSocketFactory: IWebSocketFactory = new NodeWebSocketFactory();

    constructor() {
        this.handlers = [
            ...HandlerCollections.getDefaultHandlers(this),
            new ChatLogger(this),
        ];
    }

}
