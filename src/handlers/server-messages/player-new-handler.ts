import { PlayerNew } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IGenericPlayerArgs } from "../../events/event-args/igeneric-player-args";
import { EventMessage } from "../../events/event-message";
import { Decoder } from "../../helpers/decoder";
import { Player } from "../../models/player";
import { Pos } from "../../models/pos";
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

        p.powerUps = Decoder.upgradesToPowerUps(msg.upgrades);

        this.context.state.addPlayer(p);
        this.context.eventQueue.pub(Events.PLAYER_CHANGE, {player: p} as IGenericPlayerArgs);
    }
}
