import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { PlayerLeave } from "../../ab-protocol/src/types/packets-server";

export class PlayerLeaveHandler implements IMessageHandler {
    
    handles = [Events.PLAYER_LEAVE];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as PlayerLeave;

        this.context.state.removePlayer(msg.id);
    }
}