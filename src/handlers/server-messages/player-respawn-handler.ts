import { PLAYER_STATUS } from "../../ab-protocol/src/lib";
import { PlayerRespawn } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
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

        const p = this.context.writeState.getPlayerById(msg.id);
        if (!p) {
            return;
        }
        p.pos = new Pos(msg.posX, msg.posY);
        p.rot = msg.rot;
        p.powerUps = Decoder.upgradesToPowerUps(msg.upgrades) || new PowerUps();
        p.status = PLAYER_STATUS.ALIVE;
        p.health = 1;
        p.energy = 1;

        if (msg.id === this.context.writeState.myPlayerId) {
            const wasSpectating = !!this.context.writeState.spectatingId;
            if (wasSpectating) {
                this.context.writeState.spectatingId = null;
                this.context.writeState.id = this.context.writeState.myPlayerId;
            }
        }
    }
}
