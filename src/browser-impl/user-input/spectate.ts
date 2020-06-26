import { IContext } from "../../app-context/icontext";

export class Spectate {
    constructor(private context: IContext) {

        const drop = document.getElementById("spectate");
        drop.onclick = () => this.spectate();
    }

    public spectate() {
        this.context.connection.sendCommand("spectate", "-3");
    }
}
