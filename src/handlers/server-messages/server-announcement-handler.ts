import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { ServerMessage } from "../../ab-protocol/src/types/packets-server";


export class ServerAnnouncementHandler implements IMessageHandler {

    handles = [Events.SERVER_ANNOUNCEMENT];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as ServerMessage;

        this.context.logger.info("Server message: " + msg.text);
    }
}