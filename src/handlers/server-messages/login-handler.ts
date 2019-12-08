import { Login } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IGenericPlayerArgs } from "../../events/event-args/igeneric-player-args";
import { EventMessage } from "../../events/event-message";
import { Decoder } from "../../helpers/decoder";
import { Player } from "../../models/player";
import { Pos } from "../../models/pos";
import { PowerUps } from "../../models/power-ups";
import { IMessageHandler } from "../imessage-handler";

export class LoginHandler implements IMessageHandler {

    public handles = [Events.LOGIN];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as Login;
        const s = this.context.state;
        s.id = msg.id;

        let ranking = 0;
        for (const loginPlayer of msg.players) {
            const p = new Player();
            ranking++;

            p.id = loginPlayer.id;
            p.flag = loginPlayer.flag;
            p.name = loginPlayer.name;
            p.pos = new Pos(loginPlayer.posX, loginPlayer.posY);
            p.type = loginPlayer.type;
            p.rot = loginPlayer.rot;
            p.status = loginPlayer.status;
            p.team = loginPlayer.team;
            p.ranking = ranking;
            p.health = 1;
            p.energy = 1;

            p.powerUps = Decoder.upgradesToPowerUps(loginPlayer.upgrades) || new PowerUps();

            s.addPlayer(p);

            this.context.eventQueue.pub(Events.PLAYER_CHANGE, {player: p} as IGenericPlayerArgs);
        }
    }
}
