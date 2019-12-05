import { ServerMessage } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ServerAnnouncementHandler implements IMessageHandler {

    public handles = [Events.SERVER_ANNOUNCEMENT];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as ServerMessage;

        this.context.logger.info("Server message: " + msg.text);
    }
}
