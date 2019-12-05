import { MobDespawnCoords } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IExplosionArgs } from "../../events/event-args/explosion-args";
import { EventMessage } from "../../events/event-message";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class MountainHitHandler implements IMessageHandler {

    public handles = [Events.MOUNTAIN_HIT];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as MobDespawnCoords;

        this.context.eventQueue.pub(Events.EXPLOSION, {
            pos: new Pos(msg.posX, msg.posY),
            type: msg.type,
        } as IExplosionArgs);

        this.context.state.removeMob(msg.id);
    }
}
