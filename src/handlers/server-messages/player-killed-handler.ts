import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { PlayerKill } from "../../ab-protocol/src/types/packets-server";
import { PLAYER_STATUS } from "../../ab-protocol/src/lib";

export class PlayerKilledHandler implements IMessageHandler {

    handles = [Events.PLAYER_KILLED];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as PlayerKill;

        const p = this.context.state.getPlayerById(msg.id);

        if (p) {
            p.status = PLAYER_STATUS.INACTIVE;
        }
    }
}