import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { IContext } from "../../app-context/icontext";
import { EventMessage } from "../../events/event-message";
import { PlayerLeave } from "../../ab-protocol/src/types/packets-server";

export class PlayerLeaveHandler implements IMessageHandler {
    
    handles = [Events.PLAYER_LEAVE];

    constructor(private context: IContext) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as PlayerLeave;

        this.context.state.removePlayer(msg.id);
    }
}