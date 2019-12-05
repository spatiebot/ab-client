import { Events } from "../events/constants";
import { EventMessage } from "../events/event-message";

export interface IMessageHandler {
    handles: Events[];
    exec(ev: EventMessage): void;
}
