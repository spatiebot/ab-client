import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { ScoreDetailedArgs } from "../../events/event-args/score-detailed-args";

export class ScoreDetailedHandler implements IMessageHandler {

    handles = [Events.SCORE_DETAILED];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as ScoreDetailedArgs;

        if (msg.ffaScores) {
            for (let playerScore of msg.ffaScores) {
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
            }
        } else if (msg.ctfScores) {
            for (let playerScore of msg.ctfScores) {
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
            }
        }
    }
}