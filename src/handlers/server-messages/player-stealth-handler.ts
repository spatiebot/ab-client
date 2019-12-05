import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { EventBoost, EventStealth } from "../../ab-protocol/src/types/packets-server";
import { Pos } from "../../models/pos";

export class PlayerStealthHandler implements IMessageHandler {
    
    handles = [Events.PLAYER_STEALTH];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
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