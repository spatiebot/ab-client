import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IGenericPlayerArgs } from "../../events/event-args/igeneric-player-args";
import { ScoreDetailedArgs } from "../../events/event-args/score-detailed-args";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ScoreDetailedHandler implements IMessageHandler {

    public handles = [Events.SCORE_DETAILED];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as ScoreDetailedArgs;
        let ranking = 0;

        if (msg.ffaScores) {
            for (const playerScore of msg.ffaScores) {
                ranking++;
                const player = this.context.state.getPlayerById(playerScore.id);
                if (!player) {
                    continue;
                }
                player.score = playerScore.score;
                player.level = playerScore.level;
                player.kills = playerScore.kills;
                player.deaths = playerScore.deaths;
                player.damage = playerScore.damage;
                player.ping = playerScore.ping;
                player.ranking = ranking;

                this.context.eventQueue.pub(Events.PLAYER_CHANGE, { player } as IGenericPlayerArgs);

            }
        } else if (msg.ctfScores) {
            for (const playerScore of msg.ctfScores) {
                ranking++;
                const player = this.context.state.getPlayerById(playerScore.id);
                if (!player) {
                    continue;
                }
                player.score = playerScore.score;
                player.level = playerScore.level;
                player.kills = playerScore.kills;
                player.deaths = playerScore.deaths;
                player.damage = playerScore.damage;
                player.ping = playerScore.ping;
                player.captures = playerScore.captures;
                player.ranking = ranking;

                this.context.eventQueue.pub(Events.PLAYER_CHANGE, { player } as IGenericPlayerArgs);
            }
        }
    }
}
