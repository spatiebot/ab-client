import { Error } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ServerErrorHandler implements IMessageHandler {

    public handles = [Events.SERVER_ERROR];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as Error;

        this.context.logger.error("Server reports error: " + msg.error);
    }
}
