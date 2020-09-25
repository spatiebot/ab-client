import { GameSpectate } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class PlayerSpectateHandler implements IMessageHandler {

    public handles = [Events.PLAYER_SPECTATE];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as GameSpectate;

        const p = this.context.writeState.getPlayerById(msg.id);
        if (!p) {
            return;
        }

        this.context.writeState.spectatingId = msg.id;
    }
}
