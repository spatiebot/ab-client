import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class MinimapAndPlayerListRenderHandler implements IMessageHandler {

    public handles = [Events.EACH_SECOND];

    constructor(private context: BrowserContext) {

    }

    public exec(ev: EventMessage): void {
        this.context.renderer.renderMinimap();
        this.context.renderer.renderPlayerList();
    }
}
