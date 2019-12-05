import { decodeUpgrades } from "../../ab-protocol/src/lib";
import { Login } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { Decoder } from "../../helpers/decoder";
import { Player } from "../../models/player";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class LoginHandler implements IMessageHandler {

    public handles = [Events.LOGIN];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
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
