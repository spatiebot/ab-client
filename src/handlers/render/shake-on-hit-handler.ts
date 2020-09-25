import { PlayerHit } from "../../ab-protocol/src/types/packets-server";
import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ShakeOnHitHandler implements IMessageHandler {
    public handles = [Events.PLAYER_HIT];

    constructor(private context: BrowserContext) {
    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerHit;

        if (msg.players.find((x) => x.id === this.context.readState.id)) {
            this.context.renderer.renderHit();
        }
    }
}
