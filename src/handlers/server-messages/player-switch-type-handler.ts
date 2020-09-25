import { PlayerType } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class PlayerSwitchTypeHandler implements IMessageHandler {

    public handles = [Events.PLAYER_SWITCH_TYPE];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerType;

        const p = this.context.writeState.getPlayerById(msg.id);
        if (p) {
            p.type = msg.type;
        }
    }
}
