import { EventBounce } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { Decoder } from "../../helpers/decoder";
import { MobFunctions } from "../../models/mob-functions";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class PlayerBounceHandler implements IMessageHandler {

    public handles = [Events.PLAYER_BOUNCE];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as EventBounce;

        const player = this.context.writeState.getPlayerById(msg.id);

        if (!player) {
            return;
        }

        const movements = Decoder.keystateToPlayerMovements(msg.keystate);
        MobFunctions.setMovements(player, movements);
        MobFunctions.setPos(player, msg.posX, msg.posY);
        player.rot = msg.rot;
        player.speed = new Pos(msg.speedX, msg.speedY);
    }
}
