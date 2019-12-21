import { EventBoost, EventStealth } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IGenericPlayerArgs } from "../../events/event-args/igeneric-player-args";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class PlayerStealthHandler implements IMessageHandler {

    public handles = [Events.PLAYER_STEALTH];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as EventStealth;

        const player = this.context.state.getPlayerById(msg.id);

        if (!player) {
            return;
        }

        player.stealthed = msg.state;
        player.energy = msg.energy;
        player.energyRegen = msg.energyRegen;
    }
}
