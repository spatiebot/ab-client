import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { IContext } from "../../app-context/icontext";
import { EventMessage } from "../../events/event-message";
import { GameFlag } from "../../ab-protocol/src/types/packets-server";
import { Pos } from "../../models/pos";
import { Mob } from "../../models/mob";
import { CTF_TEAMS } from "../../ab-protocol/src/lib";

export class FlagUpdateHandler implements IMessageHandler {

    handles = [Events.FLAG_UPDATE];

    constructor(private context: IContext) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as GameFlag;

        const team = this.context.state.getCtfTeam(msg.flag);
        team.flagState = msg.type;
        team.flagTakenById = msg.id;
        team.flagPos = new Pos(msg.posX, msg.posY);

        this.context.state.getCtfTeam(CTF_TEAMS.BLUE).score = msg.blueteam;
        this.context.state.getCtfTeam(CTF_TEAMS.RED).score = msg.redteam;
    }
}