import { SERVER_CUSTOM_TYPES } from "../../ab-protocol/src/lib";
import { ServerCustom, ServerCustomCTFData } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ServerCustomHandler implements IMessageHandler {

    public handles = [Events.SERVER_CUSTOM];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as ServerCustom;

        if (msg.type === SERVER_CUSTOM_TYPES.CTF) {
            const data = JSON.parse(msg.data) as ServerCustomCTFData;
            this.context.eventQueue.pub(Events.CTF_GAME_OVER, data);
        }
    }
}
