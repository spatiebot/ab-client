import { Settings } from "./settings";
import { ILogger } from "./ilogger";
import { EventQueue } from "../events/event-queue";
import { TimerManager } from "./timer-manager";
import { IMessageHandler } from "../handlers/imessage-handler";
import { EventQueueProcessor } from "./eventqueue-processor";
import { State } from "./state";

export interface IContext {

    settings: Settings;
    logger: ILogger;
    eventQueue: EventQueue;
    tm: TimerManager;
    processor: EventQueueProcessor;
    state: State;
        
    handlers: IMessageHandler[];
}