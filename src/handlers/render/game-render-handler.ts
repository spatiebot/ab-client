import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { ITickArgs } from "../../events/event-args/itick-args";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class GameRenderHandler implements IMessageHandler {

    public handles = [Events.TICK];

    constructor(private context: BrowserContext) {
    }

    public exec(ev: EventMessage): void {
        const msg = ev.args as ITickArgs;
        const isFirstTick = msg.frame === 1;

        window.requestAnimationFrame(() => this.context.renderer.renderGame(isFirstTick));
    }
}
