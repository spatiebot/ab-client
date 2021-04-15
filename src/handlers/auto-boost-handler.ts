import { IContext } from "../app-context/icontext";
import { Events } from "../events/constants";
import { EventMessage } from "../events/event-message";
import { IMessageHandler } from "./imessage-handler";
import { StopWatch } from "../helpers/stopwatch";
import { KEY_CODES } from "../ab-protocol/src/lib";

const AUTOBOOST_THRESHOLD_MS = 1000;

export class AutoBoostHandler implements IMessageHandler {
    public handles = [Events.TICK];

    private timer = new StopWatch();
    private wasAutoBoosting = false;

    constructor(private context: IContext) {
    }

    public exec(ev: EventMessage) {

        if (!this.wasAutoBoosting && !this.context.botstate.autoBoost) {
            return;
        }

        if (this.timer.elapsedMs < AUTOBOOST_THRESHOLD_MS) {
            return;
        }

        const enemyTeam = this.context.state.getOtherCtfTeam(this.context.state.team);
        if (enemyTeam && enemyTeam.flagTakenById === this.context.state.myPlayerId) {
            return;
        }

        this.timer.start();

        this.context.connection.sendKey(KEY_CODES.SPECIAL, this.context.botstate.autoBoost);
        this.wasAutoBoosting = this.context.botstate.autoBoost;
    }

}
