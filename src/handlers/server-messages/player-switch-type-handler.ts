import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { PlayerType } from "../../ab-protocol/src/types/packets-server";

export class PlayerSwitchTypeHandler implements IMessageHandler {

    handles = [Events.PLAYER_SWITCH_TYPE];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as PlayerType;

        const p = this.context.state.getPlayerById(msg.id);
        if (p) {
            p.type = msg.type;
        }
    }
}