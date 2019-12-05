import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { ScoreUpdate, PlayerUpgrade } from "../../ab-protocol/src/types/packets-server";
import { Upgrades } from "../../models/upgrades";

export class PlayerUpgradeHandler implements IMessageHandler {

    handles = [Events.PLAYER_UPGRADE];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as PlayerUpgrade;

        const player = this.context.state.getMe();

        if (!player) {
            return;
        }

        const u = new Upgrades();
        u.available = msg.upgrades;
        u.defense = msg.defense;
        u.energy = msg.energy;
        u.missile = msg.missile;
        u.speed = msg.speed;

        player.upgrades = u;
    }
}