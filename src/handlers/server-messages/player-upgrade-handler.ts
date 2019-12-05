import { PlayerUpgrade, ScoreUpdate } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IGenericPlayerArgs } from "../../events/event-args/igeneric-player-args";
import { EventMessage } from "../../events/event-message";
import { Upgrades } from "../../models/upgrades";
import { IMessageHandler } from "../imessage-handler";

export class PlayerUpgradeHandler implements IMessageHandler {

    public handles = [Events.PLAYER_UPGRADE];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
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

        this.context.eventQueue.pub(Events.PLAYER_CHANGE, { player } as IGenericPlayerArgs);

    }
}
