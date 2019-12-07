import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class GameRenderHandler implements IMessageHandler {

    public handles = [Events.TICK];

    constructor(private context: BrowserContext) {
    }

    public exec(ev: EventMessage): void {
        this.context.renderer.renderGame();
    }
}
