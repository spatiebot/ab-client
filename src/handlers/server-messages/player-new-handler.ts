import { PlayerNew } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { Decoder } from "../../helpers/decoder";
import { Player } from "../../models/player";
import { Pos } from "../../models/pos";
import { PowerUps } from "../../models/power-ups";
import { IMessageHandler } from "../imessage-handler";

export class PlayerNewHandler implements IMessageHandler {

    public handles = [Events.PLAYER_NEW];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerNew;

        const p = new Player();
        p.id = msg.id;
        p.flag = msg.flag;
        p.name = msg.name;
        p.pos = new Pos(msg.posX, msg.posY);
        p.type = msg.type;
        p.rot = msg.rot;
        p.status = msg.status;
        p.team = msg.team;
        p.energy = 1;
        p.health = 1;

        p.powerUps = Decoder.upgradesToPowerUps(msg.upgrades) || new PowerUps();

        this.context.writeState.addPlayer(p);
    }
}
