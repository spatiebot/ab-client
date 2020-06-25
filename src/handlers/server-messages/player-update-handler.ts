import { PlayerUpdate } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { Decoder } from "../../helpers/decoder";
import { Pos } from "../../models/pos";
import { PowerUps } from "../../models/power-ups";
import { Upgrades } from "../../models/upgrades";
import { IMessageHandler } from "../imessage-handler";

export class PlayerUpdateHandler implements IMessageHandler {

    public handles = [Events.PLAYER_UPDATE];

    private lastUp: boolean;

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
        player.setMovements(movements);

        const powerUps = Decoder.upgradesToPowerUps(msg.upgrades);
        player.powerUps = powerUps || new PowerUps();

        player.upgrades = player.upgrades || new Upgrades();
        player.upgrades.speed = player.powerUps.speed || 0;

        player.pos = new Pos(msg.posX, msg.posY);
        player.rot = msg.rot;
        player.speed = new Pos(msg.speedX, msg.speedY);
    }
}
