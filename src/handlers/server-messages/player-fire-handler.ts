import { PlayerFire } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { Mob } from "../../models/mob";
import { MobFunctions } from "../../models/mob-functions";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class PlayerFireHandler implements IMessageHandler {

    public handles = [Events.PLAYER_FIRE];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerFire;

        const player = this.context.writeState.getPlayerById(msg.id);

        if (!player) {
            return;
        }

        player.energy = msg.energy;
        player.energyRegen = msg.energyRegen;

        for (const missile of msg.projectiles) {
            const mob = MobFunctions.createMob(missile.posX, missile.posY);
            mob.id = missile.id;
            mob.accel = new Pos(missile.accelX, missile.accelY);
            mob.maxSpeed = missile.maxSpeed;
            mob.speed = new Pos(missile.speedX, missile.speedY);
            mob.mobType = missile.type;
            mob.ownerId = msg.id;
            mob.rot = mob.speed.direction();
            mob.team = player.team;

            this.context.writeState.addMob(mob);
        }

    }
}
