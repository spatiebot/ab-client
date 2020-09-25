import { PlayerReteam, ScoreUpdate } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class TeamsHandler implements IMessageHandler {

    public handles = [Events.TEAMS];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerReteam;

        for (const p of msg.players) {
            if (p.id === this.context.writeState.myPlayerId) {
                this.context.writeState.team = p.team;
            }

            const player = this.context.writeState.getPlayerById(p.id);
            if (!player) {
                continue;
            }

            player.team = p.team;
        }
    }
}
