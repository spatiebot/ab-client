import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { Login } from "../../ab-protocol/src/types/packets-server";
import { Player } from "../../models/player";
import { decodeUpgrades } from "../../ab-protocol/src/lib";
import { Pos } from "../../models/pos";
import { Decoder } from "../../helpers/decoder";

export class LoginHandler implements IMessageHandler {

    handles = [Events.LOGIN];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as Login;
        const s = this.context.state;
        s.id = msg.id;

        for (const loginPlayer of msg.players) {
            const p = new Player();

            p.id = loginPlayer.id;
            p.flag = loginPlayer.flag;
            p.name = loginPlayer.name;
            p.pos = new Pos(loginPlayer.posX, loginPlayer.posY);
            p.type = loginPlayer.type;
            p.rot = loginPlayer.rot;
            p.status = loginPlayer.status;
            p.team = loginPlayer.team;

            p.powerUps = Decoder.upgradesToPowerUps(loginPlayer.upgrades);

            s.addPlayer(p);
        }
    }
}