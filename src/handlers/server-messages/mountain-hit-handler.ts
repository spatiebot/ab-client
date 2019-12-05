import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { MobDespawnCoords } from "../../ab-protocol/src/types/packets-server";
import { Pos } from "../../models/pos";
import { ExplosionArgs } from "../../events/event-args/explosion-args";

export class MountainHitHandler implements IMessageHandler {

    handles = [Events.MOUNTAIN_HIT];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as MobDespawnCoords;

        this.context.eventQueue.pub(Events.EXPLOSION, { pos: new Pos(msg.posX, msg.posY), type: msg.type } as ExplosionArgs );

        this.context.state.removeMob(msg.id);
    }
}