import { PlayerUpdate } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { Decoder } from "../../helpers/decoder";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class PlayerUpdateHandler implements IMessageHandler {

    public handles = [Events.PLAYER_UPDATE];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerUpdate;

        const player = this.context.state.getPlayerById(msg.id);

        if (!player) {
            return;
        }

        player.isVisibleOnScreen = true;

        const movements = Decoder.keystateToPlayerMovements(msg.keystate);
        if (movements) {
            player.boost = movements.boost;
            player.flagspeed = movements.flagspeed;
            player.stealthed = movements.stealthed;
            player.strafe = movements.strafe;
            player.keystate = movements.keystate;
        }

        const powerUps = Decoder.upgradesToPowerUps(msg.upgrades);
        player.powerUps = powerUps;

        player.pos.x = msg.posX;
        player.pos.y = msg.posY;
        player.rot = msg.rot;
        player.speed = new Pos(msg.speedX, msg.speedY);
    }
}
