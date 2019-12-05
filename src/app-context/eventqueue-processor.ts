import { Events } from "../events/constants";
import { EventMessage } from "../events/event-message";
import { IContext } from "./icontext";

export class EventQueueProcessor {
    private isProcessing: boolean;
    private skippedFrames: number = 0;
    private handlersByType: {};

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

        this.context.tm.setInterval(() => this.tick(), 7);
    }

    private tick(): void {
        if (this.isProcessing) {
            this.skippedFrames++;
            return;
        }

        this.isProcessing = true;
        if (this.skippedFrames) {
            this.context.logger.warn(`Skipped ${this.skippedFrames} frames.`);
            this.skippedFrames = 0;
        }

        // enqueue the tick message which will be processed last
        this.context.eventQueue.pub(Events.TICK, {});

        try {
            while (true) {
                const nextMessage = this.context.eventQueue.dequeue();
                if (!nextMessage) {
                    break;
                }
                this.process(nextMessage);
            }
        } finally {
            this.isProcessing = false;
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
