import { IContext } from "../../app-context/icontext";

export class AutoPilotToFlag {
    constructor(private context: IContext) {

        const button = document.getElementById("fly-to-flag");
        button.onclick = () => this.autoPilotToFlag();
    }

    public autoPilotToFlag() {

        this.context.botstate.autoPilotToFlag = !this.context.botstate.autoPilotToFlag;
    }
}
