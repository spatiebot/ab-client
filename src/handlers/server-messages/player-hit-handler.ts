import { PlayerHit } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IExplosionArgs } from "../../events/event-args/iexplosion-args";
import { IGenericPlayerArgs } from "../../events/event-args/igeneric-player-args";
import { EventMessage } from "../../events/event-message";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class PlayerHitHandler implements IMessageHandler {

    public handles = [Events.PLAYER_HIT];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerHit;

        this.context.eventQueue.pub(Events.EXPLOSION, {
            pos: new Pos(msg.posX, msg.posY),
            type: msg.type,
        } as IExplosionArgs);

        for (const who of msg.players) {
            const player = this.context.state.getPlayerById(who.id);
            if (!player) {
                continue;
            }
            player.health = who.health;
            player.healthRegen = who.healthRegen;
        }

        this.context.state.removeMob(msg.id);
    }
}
