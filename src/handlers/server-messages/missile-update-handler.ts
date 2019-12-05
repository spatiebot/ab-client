import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { MobUpdate } from "../../ab-protocol/src/types/packets-server";
import { Pos } from "../../models/pos";
import { Mob } from "../../models/mob";

export class MissileUpdateHandler implements IMessageHandler {

    handles = [Events.MISSILE_UPDATE];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as MobUpdate;

        let mob = this.context.state.getMobById(msg.id);
        
        if (!mob) {
            mob = new Mob();
            this.context.state.addMob(mob);
        }

        mob.isVisibleOnScreen = true;
        mob.pos = new Pos(msg.posX, msg.posY);
        mob.accel = new Pos(msg.accelX, msg.accelY);
        mob.maxSpeed = msg.maxSpeed;
        mob.speed = new Pos(msg.speedX, msg.speedY);
        mob.mobType = msg.type;
        mob.ownerId = msg.id;
    }
}