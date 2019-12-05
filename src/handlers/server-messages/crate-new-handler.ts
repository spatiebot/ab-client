import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { IContext } from "../../app-context/icontext";
import { EventMessage } from "../../events/event-message";
import { MobUpdateStationary } from "../../ab-protocol/src/types/packets-server";
import { Pos } from "../../models/pos";
import { Mob } from "../../models/mob";

export class CrateNewHandler implements IMessageHandler {
    
    handles = [Events.CRATE_NEW];

    constructor(private context: IContext) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as MobUpdateStationary;

        const m = new Mob();
        m.id = msg.id;
        m.pos = new Pos(msg.posX, msg.posY);
        m.mobType = msg.type;

        this.context.state.addMob(m);
    }
}