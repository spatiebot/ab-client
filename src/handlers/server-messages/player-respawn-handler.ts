import { PLAYER_STATUS } from "../../ab-protocol/src/lib";
import { PlayerRespawn } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IGenericPlayerArgs } from "../../events/event-args/igeneric-player-args";
import { EventMessage } from "../../events/event-message";
import { Decoder } from "../../helpers/decoder";
import { Pos } from "../../models/pos";
import { PowerUps } from "../../models/power-ups";
import { IMessageHandler } from "../imessage-handler";

export class PlayerRespawnHandler implements IMessageHandler {

    public handles = [Events.PLAYER_RESPAWN];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerRespawn;

        const p = this.context.state.getPlayerById(msg.id);
        if (!p) {
            return;
        }
        p.pos = new Pos(msg.posX, msg.posY);
        p.rot = msg.rot;
        p.powerUps = Decoder.upgradesToPowerUps(msg.upgrades) || new PowerUps();
        p.status = PLAYER_STATUS.ALIVE;

        this.context.eventQueue.pub(Events.PLAYER_CHANGE, { player: p } as IGenericPlayerArgs);

    }
}
