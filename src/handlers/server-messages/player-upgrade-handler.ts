import { PlayerUpgrade, ScoreUpdate } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { Upgrades } from "../../models/upgrades";
import { IMessageHandler } from "../imessage-handler";

export class PlayerUpgradeAppliedHandler implements IMessageHandler {

    public handles = [Events.PLAYER_UPGRADE_APPLIED];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const player = this.context.state.getFocusedPlayer();

        if (!player) {
            return;
        }

        if (!player.upgrades) {
            player.upgrades = new Upgrades();
        }

        const msg = ev.args as PlayerUpgrade;

        const u = player.upgrades;
        u.available = msg.upgrades;
        u.defense = msg.defense;
        u.energy = msg.energy;
        u.missile = msg.missile;
        u.speed = msg.speed;
    }
}
