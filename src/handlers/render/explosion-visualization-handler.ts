import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { IExplosionArgs } from "../../events/event-args/iexplosion-args";
import { EventMessage } from "../../events/event-message";
import { ExplosionVisual } from "../../models/explosion-visual";
import { IMessageHandler } from "../imessage-handler";

export class ExplosionVisualizationHandler implements IMessageHandler {
    public handles = [Events.EXPLOSION];

    constructor(private context: BrowserContext) {
    }

    public exec(ev: EventMessage) {
        if (!this.context.isBrowserVisible) {
            return;
        }

        const expl = ev.args as IExplosionArgs;
        const explosion = new ExplosionVisual();
        explosion.pos = expl.pos;
        explosion.type = expl.type;
        this.context.state.addExplosion(explosion);
    }
}
