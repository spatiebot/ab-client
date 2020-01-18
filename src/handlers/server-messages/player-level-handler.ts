import { PLAYER_LEVEL_UPDATE_TYPES } from "../../ab-protocol/src/lib";
import { PlayerLevel } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class PlayerLevelHandler implements IMessageHandler {

    public handles = [Events.PLAYER_LEVEL];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {
        const msg = ev.args as PlayerLevel;

        const p = this.context.state.getPlayerById(msg.id);

        if (p) {
            p.level = msg.level;

            if (msg.type === PLAYER_LEVEL_UPDATE_TYPES.LEVELUP && msg.id === this.context.state.id) {
                this.context.eventQueue.pub(Events.MESSAGE_TO_PLAYER, {
                    message: `You have reached level ${p.level}!`,
                });
            }
        }
    }
}
