import { EventLeavehorizon } from "../../ab-protocol/src/types/packets-server";
import { LEAVE_HORIZON_TYPES } from "../../ab-protocol/src/types/server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IGenericPlayerArgs } from "../../events/event-args/igeneric-player-args";
import { EventMessage } from "../../events/event-message";
import { Mob } from "../../models/mob";
import { IMessageHandler } from "../imessage-handler";

export class LeaveHorizonHandler implements IMessageHandler {

    public handles = [Events.LEAVE_HORIZON];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as EventLeavehorizon;

        let mobOrPlayer: Mob;
        if (msg.type === LEAVE_HORIZON_TYPES.MOB) {
            mobOrPlayer = this.context.state.getMobById(msg.id);
        } else {
            mobOrPlayer = this.context.state.getPlayerById(msg.id);
        }

        if (mobOrPlayer) {
            mobOrPlayer.isVisibleOnScreen = false;
        }

        if (msg.type === LEAVE_HORIZON_TYPES.PLAYER) {
            this.context.eventQueue.pub(Events.PLAYER_CHANGE, { player: mobOrPlayer } as IGenericPlayerArgs);
        } else {
            // We don't seem to get every despawn of mobs that have left the horizon,
            // so remove it entirely now. This is what the canonical frontend does also.
            this.context.state.removeMob(msg.id);
        }

    }
}
