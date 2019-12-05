import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { IContext } from "../../app-context/icontext";
import { EventMessage } from "../../events/event-message";
import { ChatVotemutepassed } from "../../ab-protocol/src/types/packets-server";


export class ChatPlayerMutedHandler implements IMessageHandler {

    handles = [Events.CHAT_PLAYER_MUTED];

    constructor(private context: IContext) {

    }

    exec(ev: EventMessage) {

        const msg = ev.args as ChatVotemutepassed;
        const player = this.context.state.getPlayerById(msg.id);

        if (player) {
            player.isMuted = true;
        }
    }
}