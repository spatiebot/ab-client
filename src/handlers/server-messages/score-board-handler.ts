import { ScoreBoardData } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IGenericPlayerArgs } from "../../events/event-args/igeneric-player-args";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ScoreBoardHandler implements IMessageHandler {

    public handles = [Events.SCORE_BOARD];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const data = ev.args as ScoreBoardData[];

        for (const playerScore of data) {
            const player = this.context.state.getPlayerById(playerScore.id);
            if (!player) {
                continue;
            }
            player.score = playerScore.score;
            player.level = playerScore.level;

            this.context.eventQueue.pub(Events.PLAYER_CHANGE, { player } as IGenericPlayerArgs);
        }
    }
}
