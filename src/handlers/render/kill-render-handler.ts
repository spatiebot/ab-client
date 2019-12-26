import { SERVER_MESSAGE_TYPES } from "../../ab-protocol/src/lib";
import { PlayerKill } from "../../ab-protocol/src/types/packets-server";
import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

const KILL_MSG_DURATION_MS = 1000;

export class KillRenderHandler implements IMessageHandler {
    public handles = [Events.PLAYER_KILLED];

    constructor(private context: BrowserContext) {
    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerKill;

        let text = "";
        if (msg.killer === this.context.state.id) {
            text = `You have destroyed ${this.context.state.getPlayerName(msg.id)}`;
        } else if (msg.id === this.context.state.id) {
            text = `Destroyed by ${this.context.state.getPlayerName(msg.killer)}`;
        }

        if (text) {
            this.context.renderer.showServerMessage(SERVER_MESSAGE_TYPES.INFO, KILL_MSG_DURATION_MS, text);
        }
    }
}
