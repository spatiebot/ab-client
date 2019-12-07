import { Events } from "../events/constants";
import { ITickArgs } from "../events/event-args/itick-args";
import { EventMessage } from "../events/event-message";
import { StopWatch } from "../helpers/stopwatch";
import { IContext } from "./icontext";

const MS_PER_SEC = 1000;
const FPS = 60;
const TICK_MS = MS_PER_SEC / FPS;

export class EventQueueProcessor {
    private handlersByType: {};
    private skippedFrames = 0;
    private stopwatch: StopWatch;
    private tickCounter: number;

    constructor(private context: IContext) {
    }

    public startProcessingEventQueue(): void {
        this.handlersByType = {};
        for (const handler of this.context.handlers) {
            for (const eventType of handler.handles) {
                const handlersForType = this.handlersByType[eventType] || [];
                handlersForType.push(handler);
                this.handlersByType[eventType] = handlersForType;
            }
        }

        this.context.tm.setInterval(() => this.tick(), Math.floor(TICK_MS));
    }

    private tick(): void {
        if (!this.stopwatch) {
            this.stopwatch = new StopWatch();
            this.tickCounter = 1;
        }

        const diffTime = this.stopwatch.elapsedMs;

        let tooEarly = false;
        if (diffTime < TICK_MS) {
            tooEarly = true;
        } else if (diffTime > TICK_MS * (this.tickCounter + 1)) {
            this.skippedFrames++;
        } else {
            if (this.skippedFrames > 0) {
                this.context.logger.debug("Skipped frames " + this.skippedFrames);
            }
            const frameFactor = this.skippedFrames + diffTime / (TICK_MS * this.tickCounter);

            // enqueue the tick message which will be processed last
            this.context.eventQueue.pub(Events.TICK, {
                frame: this.tickCounter,
                frameFactor,
                skippedFrames: this.skippedFrames,
                timeFromStart: diffTime,
            } as ITickArgs);

            this.skippedFrames = 0;

            while (true) {
                const nextMessage = this.context.eventQueue.dequeue();
                if (!nextMessage) {
                    break;
                }
                this.process(nextMessage);
            }
        }

        if (!tooEarly) {
            this.tickCounter++;
        }

        if (this.skippedFrames > 0 || tooEarly) {
            this.context.tm.setTimeout(() => this.tick(), 1);
        }
    }

    private process(message: EventMessage) {
        // find the right handler(s)
        const handlersForType = this.handlersByType[message.type] || [];
        for (const handler of handlersForType) {
            // execute handler
            try {
                handler.exec(message);
            } catch (error) {
                // make error loggable
                const err = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
                this.context.logger.error(`Error handling message ${message.type} with handler ${handler.constructor.name}`, err);
            }
        }
    }
}
