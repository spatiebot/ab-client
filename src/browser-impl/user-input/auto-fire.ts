import { IContext } from "../../app-context/icontext";
import { KEY_CODES } from "../../ab-protocol/src/lib";

export class AutoFire {
    constructor(private context: IContext) {

        const drop = document.getElementById("auto-fire");
        drop.onclick = () => this.toggleAutoFire();
    }

    public toggleAutoFire() {
        this.context.botstate.autoFire = !this.context.botstate.autoFire;
    }
}
