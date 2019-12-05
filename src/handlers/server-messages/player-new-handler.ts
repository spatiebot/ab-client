import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { IContext } from "../../app-context/icontext";
import { EventMessage } from "../../events/event-message";
import { PlayerNew } from "../../ab-protocol/src/types/packets-server";
import { Player } from "../../models/player";
import { Pos } from "../../models/pos";
import { Decoder } from "../../helpers/decoder";

export class PlayerNewHandler implements IMessageHandler {
    
    handles = [Events.PLAYER_NEW];

    constructor(private context: IContext) {

    }

    exec(ev: EventMessage) {
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
        
        p.powerUps = Decoder.upgradesToPowerUps(msg.upgrades);

        this.context.state.addPlayer(p);
    }
}