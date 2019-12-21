import { EventBoost } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IGenericPlayerArgs } from "../../events/event-args/igeneric-player-args";
import { EventMessage } from "../../events/event-message";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class PlayerBoostHandler implements IMessageHandler {

    public handles = [Events.PLAYER_BOOST];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as EventBoost;

        const player = this.context.state.getPlayerById(msg.id);

        if (!player) {
            return;
        }

        player.boost = msg.boost;
        player.energy = msg.energy;
        player.energyRegen = msg.energyRegen;
        player.pos = new Pos(msg.posX, msg.posY);
        player.rot = msg.rot;
        player.speed = new Pos(msg.speedX, msg.speedY);
    }
}
