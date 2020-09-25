import { PLAYER_STATUS } from "../../ab-protocol/src/lib";
import { PlayerKill } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class PlayerKilledHandler implements IMessageHandler {

    public handles = [Events.PLAYER_KILLED];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerKill;

        const p = this.context.writeState.getPlayerById(msg.id);

        if (p) {
            p.status = PLAYER_STATUS.INACTIVE;
        }
    }
}
