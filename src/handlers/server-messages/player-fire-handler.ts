import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { PlayerFire } from "../../ab-protocol/src/types/packets-server";
import { Pos } from "../../models/pos";
import { Mob } from "../../models/mob";

export class PlayerFireHandler implements IMessageHandler {

    handles = [Events.PLAYER_FIRE];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as PlayerFire;

        const player = this.context.state.getPlayerById(msg.id);

        if (!player) {
            return;
        }
        
        player.energy = msg.energy;
        player.energyRegen = msg.energyRegen;

        for (const missile of msg.projectiles) {
            var mob = new Mob();
            mob.id = missile.id;
            mob.pos = new Pos(missile.posX, missile.posY);
            mob.accel = new Pos(missile.accelX, missile.accelY);
            mob.maxSpeed = missile.maxSpeed;
            mob.speed = new Pos(missile.speedX, missile.speedY);
            mob.mobType = missile.type;
            mob.ownerId = msg.id;

            this.context.state.addMob(mob);
        }

    }
}