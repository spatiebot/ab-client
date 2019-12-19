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
import { ExplosionVisualizationHandler } from "../handlers/explosion-visualization-handler";
import { IMessageHandler } from "../handlers/imessage-handler";
import { KillVisualizationHandler } from "../handlers/kill-visualization-handler";
import { ChatRenderHandler } from "../handlers/render/chat-render-handler";
import { GameRenderHandler } from "../handlers/render/game-render-handler";
import { AircraftSelection } from "./aircraft-selection";
import { BrowserLogger } from "./browser-logger";
import { BrowserWebSocketFactory } from "./browser-websocket-factory";
import { ChatInput } from "./chat-input";
import { KeyboardInput } from "./keyboard-input";
import { Renderer } from "./renderer";

export class BrowserContext implements IContext {
    public settings: Settings;
    public logger: ILogger;
    public eventQueue: EventQueue;
    public tm: TimerManager;
    public processor: EventQueueProcessor;
    public state: State;
    public handlers: IMessageHandler[];
    public webSocketFactory: IWebSocketFactory;
    public connection: Connection;

    // browser-only:
    public renderer = new Renderer(this);
    private chatInput = new ChatInput(this);
    private keyboardInput = new KeyboardInput(this, this.chatInput);
    private aircraftSelection = new AircraftSelection(this);

    constructor() {

        this.logger = new BrowserLogger();
        this.webSocketFactory = new BrowserWebSocketFactory();

        this.settings = new Settings();
        this.eventQueue = new EventQueue();
        this.tm = new TimerManager();
        this.processor = new EventQueueProcessor(this);
        this.state = new State();
        this.connection = new Connection(this);

        this.handlers = [
            ...HandlerCollections.getDefaultHandlers(this),
            new ExplosionVisualizationHandler(this),
            new KillVisualizationHandler(this),
            new GameRenderHandler(this),
            new ChatRenderHandler(this),
        ];
    }

    public async start(): Promise<any> {
        this.logger.info("Initializing app");
        this.processor.startProcessingEventQueue();

        await this.connection.init();
        this.logger.info("Initialization finished");
    }
}
