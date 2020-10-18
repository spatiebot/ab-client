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
        if (!this.context.isBrowserVisible) {
            return;
        }
        this.context.renderer.renderMinimap();
        this.context.renderer.renderPlayerList();
        this.context.renderer.showPing();
        this.context.renderer.showStats();
        this.context.renderer.hideServerMessageAfterTimeout();

        // removed for now per issue #29 (https://github.com/spatiebot/ab-client/issues/29)
        // this.context.connection.fetchDetailedScore();
    }
}
