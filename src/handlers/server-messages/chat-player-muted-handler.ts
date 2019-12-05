import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { ChatVotemutepassed } from "../../ab-protocol/src/types/packets-server";


export class ChatPlayerMutedHandler implements IMessageHandler {

    handles = [Events.CHAT_PLAYER_MUTED];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {

        const msg = ev.args as ChatVotemutepassed;
        const player = this.context.state.getPlayerById(msg.id);

        if (player) {
            player.isMuted = true;
        }
    }
}