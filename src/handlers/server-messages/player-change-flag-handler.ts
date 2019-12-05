import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { PlayerFlag } from "../../ab-protocol/src/types/packets-server";

export class PlayerChangeFlagHandler implements IMessageHandler {

    handles = [Events.PLAYER_CHANGE_FLAG];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as PlayerFlag;

        const p = this.context.state.getPlayerById(msg.id);

        if (p) {
            p.flag = msg.flag;
        }
    }
}