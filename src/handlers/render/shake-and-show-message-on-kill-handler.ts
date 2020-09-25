import { SERVER_MESSAGE_TYPES } from "../../ab-protocol/src/lib";
import { PlayerKill } from "../../ab-protocol/src/types/packets-server";
import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

const KILL_MSG_DURATION_MS = 1000;

export class ShakeAndShowMessageOnKillHandler implements IMessageHandler {
    public handles = [Events.PLAYER_KILLED];

    constructor(private context: BrowserContext) {
    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerKill;

        if (!msg.killer) {
            // spectate or switching aircraft
            return;
        }

        let text = "";
        if (msg.killer === this.context.readState.id) {
            text = `You have destroyed ${this.context.readState.getPlayerName(msg.id)}`;
        } else if (msg.id === this.context.readState.id) {
            text = `Destroyed by ${this.context.readState.getPlayerName(msg.killer)}`;
            this.context.renderer.renderKill();
        }

        if (text) {
            this.context.renderer.showServerMessage(SERVER_MESSAGE_TYPES.INFO, KILL_MSG_DURATION_MS, text);
        }
    }
}
