import { IContext } from "../app-context/icontext";
import { Events } from "../events/constants";
import { IExplosionArgs } from "../events/event-args/iexplosion-args";
import { EventMessage } from "../events/event-message";
import { Explosion } from "../models/explosion";
import { IMessageHandler } from "./imessage-handler";

export class ExplosionHandler implements IMessageHandler {
    public handles = [Events.EXPLOSION];

    constructor(private context: IContext) {
    }

    public exec(ev: EventMessage) {
        const expl = ev.args as IExplosionArgs;

        const explosion = new Explosion();
        explosion.pos = expl.pos;
        explosion.type = expl.type;
        this.context.state.addExplosion(explosion);
    }
}
