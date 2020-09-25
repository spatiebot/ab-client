import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { ScoreDetailedArgs } from "../../events/event-args/score-detailed-args";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ScoreDetailedHandler implements IMessageHandler {

    public handles = [Events.SCORE_DETAILED];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as ScoreDetailedArgs;

        if (msg.ffaScores) {
            for (const playerScore of msg.ffaScores) {
                const player = this.context.writeState.getPlayerById(playerScore.id);
                if (!player) {
                    continue;
                }
                player.score = playerScore.score;
                player.level = playerScore.level;
                player.kills = playerScore.kills;
                player.deaths = playerScore.deaths;
                player.damage = playerScore.damage;
                player.ping = playerScore.ping;
            }
        } else if (msg.ctfScores) {
            for (const playerScore of msg.ctfScores) {
                const player = this.context.writeState.getPlayerById(playerScore.id);
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
            }
        }
    }
}
