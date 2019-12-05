import { IMessageHandler } from "../imessage-handler";
import { Events } from "../../events/constants";
import { Context } from "../../app-context/context";
import { EventMessage } from "../../events/event-message";
import { PlayerHit } from "../../ab-protocol/src/types/packets-server";
import { Pos } from "../../models/pos";
import { ExplosionArgs } from "../../events/event-args/explosion-args";

export class PlayerHitHandler implements IMessageHandler {

    handles = [Events.PLAYER_HIT];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage) {
        const msg = ev.args as PlayerHit;

        this.context.eventQueue.pub(Events.EXPLOSION, { pos: new Pos(msg.posX, msg.posY), type: msg.type } as ExplosionArgs );

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