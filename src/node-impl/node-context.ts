import { GAME_TYPES } from "../ab-protocol/src/lib";
import { AuthData } from "../app-context/auth-data";
import { EventQueueProcessor } from "../app-context/eventqueue-processor";
import { HandlerCollections } from "../app-context/handler-collections";
import { IContext } from "../app-context/icontext";
import { ILogger } from "../app-context/ilogger";
import { IWebSocketFactory } from "../app-context/iwebsocket-factory";
import { Settings } from "../app-context/settings";
import { State } from "../app-context/state";
import { TimerManager } from "../app-context/timer-manager";
import { Connection } from "../connectivity/connection";
import { EventQueue } from "../events/event-queue";
import { ChatLogger } from "../handlers/chat-logger";
import { IMessageHandler } from "../handlers/imessage-handler";
import { Logger } from "./logger";
import { NodeWebSocketFactory } from "./node-websocket-factory";

export class NodeContext implements IContext {

    public gameType: GAME_TYPES;
    public settings = new Settings();
    public logger: ILogger = new Logger(this.settings);
    public eventQueue = new EventQueue();
    public tm = new TimerManager();
    public processor = new EventQueueProcessor(this);
    public readState = new State();
    public writeState = new State();
    public handlers: IMessageHandler[];
    public webSocketFactory: IWebSocketFactory = new NodeWebSocketFactory();
    public connection: Connection = new Connection(this);
    public isActive: boolean;
    public auth: AuthData; // never set in node implementation

    constructor() {
        this.handlers = [
            ...HandlerCollections.getDefaultHandlers(this),
            new ChatLogger(this),
        ];
    }

    public async start(): Promise<any> {
        this.logger.info("Initializing app");
        this.processor.startProcessingEventQueue();

        await this.connection.init();
        this.isActive = true;
        this.logger.info("Initialization finished");
    }
}
