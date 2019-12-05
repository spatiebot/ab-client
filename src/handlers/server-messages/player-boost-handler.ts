import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { EventBoost } from "../../ab-protocol/src/types/packets-server";
import { Pos } from "../../models/pos";

export class PlayerBoostHandler implements IMessageHandler {
    
    handles = [Events.PLAYER_BOOST];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as EventBoost;

        const player = this.context.state.getPlayerById(msg.id);
        
        if (!player) {
            return;
        }

        player.boost = msg.boost;
        player.energy = msg.energy;
        player.energyRegen = msg.energyRegen;
        player.pos.x = msg.posX;
        player.pos.y = msg.posY;
        player.rot = msg.rot;
        player.speed = new Pos(msg.speedX, msg.speedY);
    }
}