import { MAP_COORDS } from "../../ab-assets/map-constants";
import { PROJECTILES_SPECS } from "../../ab-assets/missile-constants";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { ITickArgs } from "../../events/event-args/itick-args";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class MissileMaintenanceHandler implements IMessageHandler {

    public handles = [Events.TICK];

    constructor(private context: IContext) {
    }

    public exec(ev: EventMessage): void {
        const tick = ev.args as ITickArgs;

        for (const missile of this.context.state.getMissiles()) {

            const missileParams = PROJECTILES_SPECS[missile.mobType];

            const prevSpeedX = missile.speed.x;
            const prevSpeedY = missile.speed.y;

            missile.speed.x += missile.accel.x * tick.frameFactor;
            missile.speed.y += missile.accel.y * tick.frameFactor;

            const speed = Math.hypot(missile.speed.x, missile.speed.y);

            if (speed > missile.maxSpeed) {
                missile.speed.x *= missile.maxSpeed / speed;
                missile.speed.y *= missile.maxSpeed / speed;
                missile.speed.length = missile.maxSpeed;
            } else {
                missile.speed.length = speed;
            }

            missile.pos.x += (prevSpeedX + 0.5 * (missile.speed.x - prevSpeedX)) * tick.frameFactor;
            missile.pos.y += (prevSpeedY + 0.5 * (missile.speed.y - prevSpeedY)) * tick.frameFactor;

            missile.distance = (missile.distance || 0) + Math.hypot(missile.speed.x, missile.speed.y);

            if (
                missile.pos.x < MAP_COORDS.MIN_X ||
                missile.pos.x > MAP_COORDS.MAX_X ||
                missile.pos.y < MAP_COORDS.MIN_Y ||
                missile.pos.y > MAP_COORDS.MAX_Y ||
                missile.distance >= missileParams.distance
            ) {
               this.context.state.removeMob(missile.id);
            }
        }
    }
}
