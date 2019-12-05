import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { ScoreUpdate, PlayerUpgrade, PlayerPowerup } from "../../ab-protocol/src/types/packets-server";
import { Upgrades } from "../../models/upgrades";
import { PLAYER_POWERUP_TYPES } from "../../ab-protocol/src/lib";

export class PlayerPowerupHandler implements IMessageHandler {

    handles = [Events.PLAYER_POWERUP];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as PlayerPowerup;

        const player = this.context.state.getMe();
        if (player) {
            player.hasShield = msg.type == PLAYER_POWERUP_TYPES.SHIELD;
            player.hasInferno = msg.type == PLAYER_POWERUP_TYPES.INFERNO;
            player.shieldOrInfernoDuration = msg.duration;
        }
    }
}