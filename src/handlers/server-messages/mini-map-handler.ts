import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { ScoreBoardData, ScoreBoardRanking } from "../../ab-protocol/src/types/packets-server";
import { PLAYER_STATUS, decodeMinimapCoords } from "../../ab-protocol/src/lib";
import { Pos } from "../../models/pos";

export class MiniMapHandler implements IMessageHandler {

    handles = [Events.MINI_MAP];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const data = ev.args as ScoreBoardRanking[];

        for (let playerMinimapPos of data) {
            const player = this.context.state.getPlayerById(playerMinimapPos.id);
            if (!player) {
                continue;
            }

            if (playerMinimapPos.x === 0 && playerMinimapPos.y === 0) {
                player.status = PLAYER_STATUS.INACTIVE;
            } else {
                const coords = decodeMinimapCoords(playerMinimapPos.x, playerMinimapPos.y);
                player.lowResPos = new Pos(coords);
            }
        }
    }
}