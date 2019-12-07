import { Keystate } from "../../ab-protocol/src/lib";
import { EventRepel } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IGenericPlayerArgs } from "../../events/event-args/igeneric-player-args";
import { EventMessage } from "../../events/event-message";
import { Decoder } from "../../helpers/decoder";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class PlayerRepelHandler implements IMessageHandler {

    public handles = [Events.PLAYER_REPEL];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as EventRepel;

        const player = this.context.state.getPlayerById(msg.id);
        if (player) {
            player.pos.x = msg.posX;
            player.pos.y = msg.posY;
            player.rot = msg.rot;
            player.speed = new Pos(msg.speedX, msg.speedY);
            player.energyRegen = msg.energyRegen;
            player.energy = msg.energy;
            this.context.eventQueue.pub(Events.PLAYER_CHANGE, { player } as IGenericPlayerArgs);
        }

        for (const repelledPlayer of msg.players) {
            const p = this.context.state.getPlayerById(repelledPlayer.id);

            if (!p) {
                continue;
            }

            const movements = Decoder.keystateToPlayerMovements(repelledPlayer.keystate);
            p.setMovements(movements);

            p.pos.x = repelledPlayer.posX;
            p.pos.y = repelledPlayer.posY;
            p.rot = repelledPlayer.rot;
            p.speed = new Pos(repelledPlayer.speedX, repelledPlayer.speedY);
            p.energyRegen = repelledPlayer.energyRegen;
            p.energy = repelledPlayer.energy;
            p.health = repelledPlayer.playerHealth;
            p.healthRegen = repelledPlayer.playerHealthRegen;

            this.context.eventQueue.pub(Events.PLAYER_CHANGE, { player: p } as IGenericPlayerArgs);
        }

        for (const missile of msg.mobs) {
            const mob = this.context.state.getMobById(missile.id);

            if (!mob) {
                continue;
            }

            mob.pos = new Pos(missile.posX, missile.posY);
            mob.accel = new Pos(missile.accelX, missile.accelY);
            mob.maxSpeed = missile.maxSpeed;
            mob.speed = new Pos(missile.speedX, missile.speedY);
            mob.mobType = missile.type;
            mob.ownerId = msg.id;
        }

    }
}
