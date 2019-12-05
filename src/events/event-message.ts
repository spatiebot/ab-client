import { Events } from "./constants";

export class EventMessage {
    public type: Events;
    public args: any;
}