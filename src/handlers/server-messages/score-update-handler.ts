import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { IContext } from "../../app-context/icontext";
import { EventMessage } from "../../events/event-message";
import { ScoreUpdate } from "../../ab-protocol/src/types/packets-server";

export class ScoreUpdateHandler implements IMessageHandler {

    handles = [Events.SCORE_UPDATE];

    constructor(private context: IContext) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as ScoreUpdate;

        const player = this.context.state.getPlayerById(msg.id);
        if (player) {
            player.score = msg.score;
            player.kills = msg.totalkills;
            player.deaths = msg.totalkills;
        }
    }
}