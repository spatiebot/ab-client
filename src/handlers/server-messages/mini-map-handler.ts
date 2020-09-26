import { decodeMinimapCoords, PLAYER_STATUS } from "../../ab-protocol/src/lib";
import { ScoreBoardRanking } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { MobFunctions } from "../../models/mob-functions";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class MiniMapHandler implements IMessageHandler {

    public handles = [Events.MINI_MAP];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const data = ev.args as ScoreBoardRanking[];

        for (const playerMinimapPos of data) {
            const player = this.context.writeState.getPlayerById(playerMinimapPos.id);
            if (!player) {
                continue;
            }

            if (playerMinimapPos.x === 0 && playerMinimapPos.y === 0) {
                // invisible prowler may not get the correct minimap data,
                // so ignore this if i'm hidden as a prowler
                const focusAircraft = this.context.writeState.getFocusedPlayer();
                if (focusAircraft && focusAircraft.stealthed) {
                    player.status = PLAYER_STATUS.INACTIVE;
                }
            } else {
                const coords = decodeMinimapCoords(playerMinimapPos.x, playerMinimapPos.y);
                MobFunctions.setPosFromMinimap(player, new Pos(coords));
            }
        }
    }
}
