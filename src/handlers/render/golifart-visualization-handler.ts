import { EventRepel } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { GoliFartVisual } from "../../models/golifart-visual";
import { IMessageHandler } from "../imessage-handler";

export class GoliFartVisualizationHandler implements IMessageHandler {
    public handles = [Events.PLAYER_REPEL];

    constructor(private context: IContext) {
    }

    public exec(ev: EventMessage) {
        const repel = ev.args as EventRepel;

        const fartVisual = new GoliFartVisual();
        fartVisual.player = this.context.readState.getPlayerById(repel.id);
        this.context.writeState.addFart(fartVisual);
    }
}
