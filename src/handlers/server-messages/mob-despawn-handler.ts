import { MobDespawn } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class MobDespawnHandler implements IMessageHandler {

    public handles = [Events.MOB_DESPAWN];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as MobDespawn;
        this.context.writeState.removeMob(msg.id);
    }
}
