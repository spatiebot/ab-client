import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class StatsRenderHandler implements IMessageHandler {
    public handles = [Events.STATS_UPDATE];

    constructor(private context: BrowserContext) {
    }

    public exec(ev: EventMessage) {
        const me = this.context.state.getMe();
        if (!me) {
            return;
        }

        this.context.renderer.showStats(me.score, me.kills, me.deaths, me.upgrades, this.context.state.ping);
    }
}
