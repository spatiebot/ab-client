import { ChatVotemutepassed } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ChatPlayerMutedHandler implements IMessageHandler {

    public handles = [Events.CHAT_PLAYER_MUTED];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {

        const msg = ev.args as ChatVotemutepassed;
        const player = this.context.state.getPlayerById(msg.id);

        if (player) {
            player.isMuted = true;
        }
    }
}
