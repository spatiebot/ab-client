import { IContext } from "../app-context/icontext";
import { Events } from "../events/constants";
import { EventMessage } from "../events/event-message";
import { IMessageHandler } from "./imessage-handler";
import { StopWatch } from "../helpers/stopwatch";
import { KEY_CODES } from "../ab-protocol/src/lib";

const AUTOFIRE_THRESHOLD_MS = 250;
export class AutoFireHandler implements IMessageHandler {
    public handles = [Events.TICK];

    private timer = new StopWatch();
    private wasAutoFiring = false;

    constructor(private context: IContext) {
    }

    public exec(ev: EventMessage) {

        if (!this.wasAutoFiring && !this.context.botstate.autoFire) {
            return;
        }

        if (this.timer.elapsedMs < AUTOFIRE_THRESHOLD_MS) {
            return;
        }

        this.timer.start();

        this.context.connection.sendKey(KEY_CODES.FIRE, this.context.botstate.autoFire);
        this.wasAutoFiring = this.context.botstate.autoFire;
    }

}
