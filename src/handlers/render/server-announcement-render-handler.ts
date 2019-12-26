import { ServerMessage } from "../../ab-protocol/src/types/packets-server";
import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ServerAnnouncementRenderHandler implements IMessageHandler {

    public handles = [Events.SERVER_ANNOUNCEMENT];

    constructor(private context: BrowserContext) {

    }

    public exec(ev: EventMessage): void {
        const msg = ev.args as ServerMessage;

        this.context.renderer.showServerMessage(msg.type, msg.duration, msg.text);
    }
}
