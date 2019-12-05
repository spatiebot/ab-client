import { PlayerFire } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IGenericPlayerArgs } from "../../events/event-args/igeneric-player-args";
import { EventMessage } from "../../events/event-message";
import { Mob } from "../../models/mob";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class PlayerFireHandler implements IMessageHandler {

    public handles = [Events.PLAYER_FIRE];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerFire;

        const player = this.context.state.getPlayerById(msg.id);

        if (!player) {
            return;
        }

        player.energy = msg.energy;
        player.energyRegen = msg.energyRegen;
        this.context.eventQueue.pub(Events.PLAYER_CHANGE, { player } as IGenericPlayerArgs);

        for (const missile of msg.projectiles) {
            const mob = new Mob();
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
