import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { IContext } from "../../app-context/icontext";
import { EventMessage } from "../../events/event-message";
import { PlayerRespawn } from "../../ab-protocol/src/types/packets-server";
import { Pos } from "../../models/pos";
import { Decoder } from "../../helpers/decoder";
import { PLAYER_STATUS } from "../../ab-protocol/src/lib";

export class PlayerRespawnHandler implements IMessageHandler {

    handles = [Events.PLAYER_RESPAWN];

    constructor(private context: IContext) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as PlayerRespawn;

        const p = this.context.state.getPlayerById(msg.id);
        if (!p) {
            return;
        }
        p.pos = new Pos(msg.posX, msg.posY);
        p.rot = msg.rot;
        p.powerUps = Decoder.upgradesToPowerUps(msg.upgrades);
        p.status = PLAYER_STATUS.ALIVE;
    }
}