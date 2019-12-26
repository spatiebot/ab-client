import { IContext } from "../../app-context/icontext";

export class AircraftSelection {

    constructor(private context: IContext) {
        const raptor = document.getElementById("select-raptor");
        raptor.onclick = () => this.selectAircraft("1");
        const spirit = document.getElementById("select-spirit");
        spirit.onclick = () => this.selectAircraft("2");
        const mohawk = document.getElementById("select-mohawk");
        mohawk.onclick = () => this.selectAircraft("3");
        const tornado = document.getElementById("select-tornado");
        tornado.onclick = () => this.selectAircraft("4");
        const prowler = document.getElementById("select-prowler");
        prowler.onclick = () => this.selectAircraft("5");
    }

    public selectAircraft(selection: string) {
        this.context.connection.sendCommand("respawn", selection);
    }
}
