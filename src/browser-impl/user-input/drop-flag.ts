import { IContext } from "../../app-context/icontext";

export class DropFlag {
    constructor(private context: IContext) {

        const drop = document.getElementById("drop-flag");
        drop.onclick = () => this.dropFlag();
    }

    public dropFlag() {
        this.context.connection.sendCommand("drop", "");
    }
}
