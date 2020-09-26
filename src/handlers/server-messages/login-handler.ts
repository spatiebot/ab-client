import { CTF_TEAMS, GAME_TYPES, PLAYER_STATUS } from "../../ab-protocol/src/lib";
import { Login } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { Decoder } from "../../helpers/decoder";
import { MobFunctions } from "../../models/mob-functions";
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
        const s = this.context.writeState;

        s.id = msg.id;

        // the id given is the id of the user we are spectating
        // in case of spectating.
        const isSpectating = !!s.spectatingId;
        if (!isSpectating) {
            s.myPlayerId = msg.id;
        }

        if (!msg.players) {
            // this is a message that is used for spectate start
            return;
        }

        s.team = msg.team;

        this.context.gameType = GAME_TYPES.FFA;
        if (msg.team === CTF_TEAMS.BLUE || msg.team === CTF_TEAMS.RED) {
            this.context.gameType = GAME_TYPES.CTF;
        }


        let ranking = 0;

        for (const loginPlayer of msg.players) {
            const p = MobFunctions.createPlayer();
            ranking++;

            p.id = loginPlayer.id;
            p.flag = loginPlayer.flag;
            p.name = loginPlayer.name;
            p.type = loginPlayer.type;
            p.rot = loginPlayer.rot;
            p.status = loginPlayer.status;
            p.team = loginPlayer.team;
            p.ranking = ranking;
            p.health = 1;
            p.energy = 1;
            p.level = loginPlayer.level;

            p.powerUps = Decoder.upgradesToPowerUps(loginPlayer.upgrades) || new PowerUps();

            MobFunctions.setPos(p, loginPlayer.posX, loginPlayer.posY);

            s.addPlayer(p);
        }
    }
}
