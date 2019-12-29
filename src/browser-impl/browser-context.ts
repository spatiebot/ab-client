import { GAME_TYPES } from "../ab-protocol/src/lib";
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
import { FlagCookieHandler } from "../handlers/flag-cookie-handler";
import { IMessageHandler } from "../handlers/imessage-handler";
import { KillVisualizationHandler } from "../handlers/kill-visualization-handler";
import { ChatRenderHandler } from "../handlers/render/chat-render-handler";
import { CtfGameOverRenderHandler } from "../handlers/render/ctf-game-over-render-handler";
import { EachSecondRenderHandler } from "../handlers/render/each-second-render-handler";
import { GameRenderHandler } from "../handlers/render/game-render-handler";
import { KillRenderHandler } from "../handlers/render/kill-render-handler";
import { ServerAnnouncementRenderHandler } from "../handlers/render/server-announcement-render-handler";
import { BrowserLogger } from "./browser-logger";
import { BrowserWebSocketFactory } from "./browser-websocket-factory";
import { Renderer } from "./renderers/renderer";
import { AircraftSelection } from "./user-input/aircraft-selection";
import { ApplyUpgrades } from "./user-input/apply-upgrades";
import { ChatInput } from "./user-input/chat-input";
import { KeyboardInput } from "./user-input/keyboard-input";

export class BrowserContext implements IContext {
    public gameType: GAME_TYPES;
    public settings: Settings;
    public logger: ILogger;
    public eventQueue: EventQueue;
    public tm: TimerManager;
    public processor: EventQueueProcessor;
    public state: State;
    public handlers: IMessageHandler[];
    public webSocketFactory: IWebSocketFactory;
    public connection: Connection;
    public isActive: boolean;

    // browser-only:
    public renderer = new Renderer(this);
    private chatInput = new ChatInput(this);
    private aircraftSelection = new AircraftSelection(this);
    private upgradeSelection = new ApplyUpgrades(this);
    private keyboardInput = new KeyboardInput(this, this.chatInput, this.upgradeSelection, this.aircraftSelection);

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
            new EachSecondRenderHandler(this),
            new ServerAnnouncementRenderHandler(this),
            new CtfGameOverRenderHandler(this),
            new KillRenderHandler(this),
            new FlagCookieHandler(),
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
