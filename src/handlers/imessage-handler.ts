import { EventMessage } from "../events/event-message";
import { Events } from "../events/constants";

export interface IMessageHandler {
    handles: Events[];
    exec(ev: EventMessage);
}