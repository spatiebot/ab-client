import { CTF_TEAMS, SERVER_MESSAGE_TYPES } from "../../ab-protocol/src/lib";
import { ServerCustomCTFData } from "../../ab-protocol/src/types/packets-server";
import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class CtfGameOverRenderHandler implements IMessageHandler {

    public handles = [Events.CTF_GAME_OVER];

    constructor(private context: BrowserContext) {
    }

    public exec(ev: EventMessage): void {
        const msg = ev.args as ServerCustomCTFData;

        this.context.renderer.showServerMessage(SERVER_MESSAGE_TYPES.INFO, msg.t,
            `Game over!<br/>The ${msg.w === CTF_TEAMS.BLUE ? "blue" : "red"} team has won!`);
    }
}
