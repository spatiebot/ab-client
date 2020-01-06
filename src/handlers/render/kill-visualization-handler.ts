import { PlayerKill } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { KillVisual } from "../../models/kill-visual";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class KillVisualizationHandler implements IMessageHandler {
    public handles = [Events.PLAYER_KILLED];

    constructor(private context: IContext) {
    }

    public exec(ev: EventMessage) {
        const kill = ev.args as PlayerKill;

        const killVisual = new KillVisual();
        killVisual.pos = new Pos(kill.posX, kill.posY);
        this.context.state.addKill(killVisual);
    }
}
