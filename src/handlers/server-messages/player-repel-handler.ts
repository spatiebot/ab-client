import { EventRepel } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { Decoder } from "../../helpers/decoder";
import { MobFunctions } from "../../models/mob-functions";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class PlayerRepelHandler implements IMessageHandler {

    public handles = [Events.PLAYER_REPEL];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as EventRepel;

        const player = this.context.writeState.getPlayerById(msg.id);
        if (player) {
            MobFunctions.setPos(player, msg.posX, msg.posY);
            player.rot = msg.rot;
            player.speed = new Pos(msg.speedX, msg.speedY);
            player.energyRegen = msg.energyRegen;
            player.energy = msg.energy;
        }

        for (const repelledPlayer of msg.players) {
            const p = this.context.writeState.getPlayerById(repelledPlayer.id);

            if (!p) {
                continue;
            }

            const movements = Decoder.keystateToPlayerMovements(repelledPlayer.keystate);
            MobFunctions.setMovements(p, movements);

            MobFunctions.setPos(p, repelledPlayer.posX, repelledPlayer.posY);
            p.rot = repelledPlayer.rot;
            p.speed = new Pos(repelledPlayer.speedX, repelledPlayer.speedY);
            p.energyRegen = repelledPlayer.energyRegen;
            p.energy = repelledPlayer.energy;
            p.health = repelledPlayer.playerHealth;
            p.healthRegen = repelledPlayer.playerHealthRegen;
        }

        for (const missile of msg.mobs) {
            const mob = this.context.writeState.getMobById(missile.id);

            if (!mob) {
                continue;
            }

            MobFunctions.setPos(mob, missile.posX, missile.posY);
            mob.accel = new Pos(missile.accelX, missile.accelY);
            mob.maxSpeed = missile.maxSpeed;
            mob.speed = new Pos(missile.speedX, missile.speedY);
            mob.rot = mob.speed.direction();
            mob.mobType = missile.type;
            mob.ownerId = msg.id;
            mob.team = player.team;
        }

    }
}
