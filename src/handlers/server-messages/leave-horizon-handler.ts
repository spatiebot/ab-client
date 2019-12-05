import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { IContext } from "../../app-context/icontext";
import { EventMessage } from "../../events/event-message";
import { EventLeavehorizon } from "../../ab-protocol/src/types/packets-server";
import { LEAVE_HORIZON_TYPES } from "../../ab-protocol/src/types/server";
import { Mob } from "../../models/mob";

export class LeaveHorizonHandler implements IMessageHandler {

    handles = [Events.LEAVE_HORIZON];

    constructor(private context: IContext) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as EventLeavehorizon;

        let mobOrPlayer: Mob;
        if (msg.type == LEAVE_HORIZON_TYPES.MOB) {
            mobOrPlayer = this.context.state.getMobById(msg.id);
        } else {
            mobOrPlayer = this.context.state.getPlayerById(msg.id);
        }

        if (mobOrPlayer) {
            mobOrPlayer.isVisibleOnScreen = false;
        }
    }
}