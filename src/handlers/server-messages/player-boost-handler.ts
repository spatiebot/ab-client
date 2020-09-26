import { EventBoost } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { MobFunctions } from "../../models/mob-functions";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class PlayerBoostHandler implements IMessageHandler {

    public handles = [Events.PLAYER_BOOST];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as EventBoost;

        const player = this.context.writeState.getPlayerById(msg.id);

        if (!player) {
            return;
        }

        player.boost = msg.boost;
        player.energy = msg.energy;
        player.energyRegen = msg.energyRegen;
        player.rot = msg.rot;
        player.speed = new Pos(msg.speedX, msg.speedY);

        MobFunctions.setPos(player, msg.posX, msg.posY);
    }
}
