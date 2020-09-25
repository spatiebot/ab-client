import { MobUpdateStationary } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { Mob } from "../../models/mob";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class CrateNewHandler implements IMessageHandler {

    public handles = [Events.CRATE_NEW];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as MobUpdateStationary;

        const m = new Mob();
        m.id = msg.id;
        m.pos = new Pos(msg.posX, msg.posY);
        m.mobType = msg.type;

        this.context.writeState.addMob(m);
    }
}
