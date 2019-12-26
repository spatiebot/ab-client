import { GAME_TYPES } from "../ab-protocol/src/lib";
import { Connection } from "../connectivity/connection";
import { EventQueue } from "../events/event-queue";
import { IMessageHandler } from "../handlers/imessage-handler";
import { EventQueueProcessor } from "./eventqueue-processor";
import { ILogger } from "./ilogger";
import { IWebSocketFactory } from "./iwebsocket-factory";
import { Settings } from "./settings";
import { State } from "./state";
import { TimerManager } from "./timer-manager";

export interface IContext {

    settings: Settings;
    logger: ILogger;
    eventQueue: EventQueue;
    tm: TimerManager;
    processor: EventQueueProcessor;
    state: State;
    webSocketFactory: IWebSocketFactory;
    connection: Connection;

    handlers: IMessageHandler[];

    isActive: boolean;

    gameType: GAME_TYPES;

    start(): Promise<any>;
}
