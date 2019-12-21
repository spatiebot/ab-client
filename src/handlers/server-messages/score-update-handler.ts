import { ScoreUpdate } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IGenericPlayerArgs } from "../../events/event-args/igeneric-player-args";
import { EventMessage } from "../../events/event-message";
import { Upgrades } from "../../models/upgrades";
import { IMessageHandler } from "../imessage-handler";

export class ScoreUpdateHandler implements IMessageHandler {

    public handles = [Events.SCORE_UPDATE];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as ScoreUpdate;

        const player = this.context.state.getPlayerById(msg.id);
        if (player) {
            player.score = msg.score;
            player.kills = msg.totalkills;
            player.deaths = msg.totaldeaths;

            if (!player.upgrades) {
                player.upgrades = new Upgrades();
            }
            player.upgrades.available = msg.upgrades;

            this.context.eventQueue.pub(Events.STATS_UPDATE, { });
        }
    }
}
