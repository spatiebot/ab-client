import { PLAYER_POWERUP_TYPES } from "../../ab-protocol/src/lib";
import { PlayerPowerup } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { StopWatch } from "../../helpers/stopwatch";
import { IMessageHandler } from "../imessage-handler";

export class PlayerPowerupHandler implements IMessageHandler {

    public handles = [Events.PLAYER_POWERUP];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerPowerup;

        const player = this.context.state.getFocusedPlayer();
        if (player) {
            player.hasShield = msg.type === PLAYER_POWERUP_TYPES.SHIELD;
            player.hasInferno = msg.type === PLAYER_POWERUP_TYPES.INFERNO;
            player.shieldOrInfernoTimer = new StopWatch(msg.duration);
        }
    }
}
