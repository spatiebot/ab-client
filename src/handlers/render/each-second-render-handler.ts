import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

// renders stuff that is not that important each second
export class EachSecondRenderHandler implements IMessageHandler {

    public handles = [Events.EACH_SECOND];

    constructor(private context: BrowserContext) {

    }

    public exec(ev: EventMessage): void {
        this.context.renderer.renderMinimap();
        this.context.renderer.renderPlayerList();
        this.context.renderer.showPing();
        this.context.renderer.showStats();

        this.context.connection.fetchDetailedScore();
    }
}
