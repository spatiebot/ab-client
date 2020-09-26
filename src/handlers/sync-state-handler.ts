import { IContext } from "../app-context/icontext";
import { Events } from "../events/constants";
import { EventMessage } from "../events/event-message";
import { IMessageHandler } from "./imessage-handler";

export class SyncStateHandler implements IMessageHandler {
    public handles = [Events.TICK];

    constructor(private context: IContext) {
    }

    public exec(ev: EventMessage) {

        this.context.readState.syncFrom(this.context.writeState);

    }

}
