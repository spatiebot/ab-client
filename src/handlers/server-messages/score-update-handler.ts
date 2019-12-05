import { ScoreUpdate } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
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
            player.deaths = msg.totalkills;
        }
    }
}
