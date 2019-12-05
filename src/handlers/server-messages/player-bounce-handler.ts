import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { IContext } from "../../app-context/icontext";
import { EventMessage } from "../../events/event-message";
import { EventBounce } from "../../ab-protocol/src/types/packets-server";
import { Pos } from "../../models/pos";
import { Decoder } from "../../helpers/decoder";

export class PlayerBounceHandler implements IMessageHandler {
    
    handles = [Events.PLAYER_BOUNCE];

    constructor(private context: IContext) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as EventBounce;

        const player = this.context.state.getPlayerById(msg.id);
        
        if (!player) {
            return;
        }

        const movements = Decoder.keystateToPlayerMovements(msg.keystate);
        if (movements) {
            player.boost = movements.boost;
            player.flagspeed = movements.flagspeed;
            player.stealthed = movements.stealthed;
            player.strafe = movements.strafe;
            player.keystate = movements.keystate;
        }
        
        player.pos.x = msg.posX;
        player.pos.y = msg.posY;
        player.rot = msg.rot;
        player.speed = new Pos(msg.speedX, msg.speedY);
    }
}