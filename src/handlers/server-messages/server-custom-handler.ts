import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { ServerCustom, ServerCustomCTFData } from "../../ab-protocol/src/types/packets-server";
import { SERVER_CUSTOM_TYPES } from "../../ab-protocol/src/lib";


export class ServerCustomHandler implements IMessageHandler {

    handles = [Events.SERVER_CUSTOM];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as ServerCustom;

        if (msg.type === SERVER_CUSTOM_TYPES.CTF) {
            const data = JSON.parse(msg.data) as ServerCustomCTFData;
            this.context.eventQueue.pub(Events.CTF_GAME_OVER, data);
        }
    }
}