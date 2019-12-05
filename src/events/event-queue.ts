import { Events } from "./constants";
import { EventMessage } from "./event-message";

export class EventQueue {
    private queue: EventMessage[] = [];

    public pub(ev: Events, args: any): void {
        const msg = new EventMessage();
        msg.type = ev;
        msg.args = args;

        this.queue.push(msg);
    }

    public dequeue(): EventMessage {
        return this.queue.shift();
    }

}
