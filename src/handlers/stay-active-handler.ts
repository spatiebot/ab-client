import { IContext } from "../app-context/icontext";
import { Events } from "../events/constants";
import { EventMessage } from "../events/event-message";
import { IMessageHandler } from "./imessage-handler";
import { KEY_CODES } from "../ab-protocol/src/lib";

export class StayActiveHandler implements IMessageHandler {
    public handles = [Events.EACH_SECOND];

    constructor(private context: IContext) {
    }

    public exec(ev: EventMessage) {

        // only do this when spectating
        if (!this.context.state.spectatingId) {
            return;
        }

        this.context.connection.sendKey(KEY_CODES.SPECIAL, true);
    }

}
