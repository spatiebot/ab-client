import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { IContext } from "../../app-context/icontext";
import { EventMessage } from "../../events/event-message";
import { ScoreUpdate, PlayerReteam } from "../../ab-protocol/src/types/packets-server";

export class TeamsHandler implements IMessageHandler {

    handles = [Events.TEAMS];

    constructor(private context: IContext) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as PlayerReteam;

        for (const p of msg.players) {
            const player = this.context.state.getPlayerById(p.id);
            if (!player) {
                continue;
            }

            player.team = p.team;
        }
    }
}