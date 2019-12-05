import { decodeMinimapCoords, PLAYER_STATUS } from "../../ab-protocol/src/lib";
import { ScoreBoardData, ScoreBoardRanking } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class MiniMapHandler implements IMessageHandler {

    public handles = [Events.MINI_MAP];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const data = ev.args as ScoreBoardRanking[];

        for (const playerMinimapPos of data) {
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
