import { MobUpdate } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { Mob } from "../../models/mob";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class MissileUpdateHandler implements IMessageHandler {

    public handles = [Events.MISSILE_UPDATE];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as MobUpdate;

        let mob = this.context.state.getMobById(msg.id);

        if (!mob) {
            mob = new Mob();
            mob.id = msg.id;
            this.context.state.addMob(mob);
        }

        mob.isVisibleOnScreen = true;
        mob.pos = new Pos(msg.posX, msg.posY);
        mob.accel = new Pos(msg.accelX, msg.accelY);
        mob.maxSpeed = msg.maxSpeed;
        mob.speed = new Pos(msg.speedX, msg.speedY);
        mob.rot = mob.speed.direction();
        mob.mobType = msg.type;
    }
}
