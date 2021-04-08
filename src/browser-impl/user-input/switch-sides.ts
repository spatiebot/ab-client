import { IContext } from "../../app-context/icontext";
import { ServerMessage } from "../../ab-protocol/src/types/packets-server";
import { Events } from "../../events/constants";
import { StopWatch } from "../../helpers/stopwatch";
import { AutoFire } from "./auto-fire";

export class SwitchSides {

    private timer: StopWatch;

    constructor(private context: IContext, private autoFire: AutoFire) {

        const switchSides = document.getElementById("switch-sides");
        switchSides.onclick = () => this.switch();
    }

    public switch() {
        // prevent an endless loop if spectating fails
        if (this.timer && this.timer.elapsedSeconds > 5) {
            this.showMessage("Switch failed, giving up.")
            this.timer = null;
            return;
        }

        if (!this.timer) {
            this.timer = new StopWatch();
        }

        this.context.botstate.stop();

        const c = this.context;

        if (c.state.isAutoFiring) {
            this.showMessage("Switching, stopping autofire...");
            this.autoFire.toggleAutoFire();
            c.tm.setTimeout(() => this.switch(), 2000);
            return;
        }

        if (!c.state.spectatingId) {
            this.showMessage("Switching, entering spec mode...")
            c.connection.sendCommand("spectate", "-3");
            c.tm.setTimeout(() => this.switch(), 500 + this.timer.elapsedMs / 4);
            return;
        }

        this.timer = null;
        this.showMessage("Switching...")
        c.connection.sendCommand("switch", "");
        c.tm.setTimeout(() => {
            this.showMessage("Switching, respawning...")
            const myAircraft = c.state.getPlayerById(c.state.myPlayerId);
            c.connection.sendCommand("respawn", myAircraft.type.toString());
        }, 500);
    }

    private showMessage(msg: string) {
        const servermessage = {
            text: msg,
            duration: 1000
        } as ServerMessage;

        this.context.eventQueue.pub(Events.SERVER_ANNOUNCEMENT, servermessage);
    }
}
