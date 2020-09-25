import { PlayerFlag } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class PlayerChangeFlagHandler implements IMessageHandler {

    public handles = [Events.PLAYER_CHANGE_FLAG];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerFlag;

        const p = this.context.writeState.getPlayerById(msg.id);

        if (p) {
            p.flag = msg.flag;
        }
    }
}
