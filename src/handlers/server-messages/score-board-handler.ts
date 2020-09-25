import { ScoreBoardData } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ScoreBoardHandler implements IMessageHandler {

    public handles = [Events.SCORE_BOARD];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const data = ev.args as ScoreBoardData[];

        let ranking = 0;
        for (const playerScore of data) {
            ranking++;
            const player = this.context.writeState.getPlayerById(playerScore.id);
            if (!player) {
                continue;
            }
            player.score = playerScore.score;
            player.level = playerScore.level;
            player.ranking = ranking;
        }
    }
}
