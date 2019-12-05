import { Events } from "./constants";
import { EventMessage } from "./event-message";

export class EventQueue {
    private _queue: EventMessage[] = [];

    pub(ev: Events, args: any): void {
        const msg = new EventMessage();
        msg.type = ev;
        msg.args = args;

        this._queue.push(msg);
    }

    dequeue(): EventMessage {
        return this._queue.shift();
    }

}