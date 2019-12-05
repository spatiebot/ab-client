import { EventMessage } from "../events/event-message";
import { IContext } from "./icontext";

export class EventQueueProcessor {
    private isProcessing: boolean;
    private skippedFrames: number = 0;

    constructor(private context: IContext) {
    }

    public startProcessingEventQueue(): void {
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
        for (const handler of this.context.handlers) {
            if (handler.handles.indexOf(message.type) > -1) {
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
}
