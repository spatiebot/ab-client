import { IContext } from "../app-context/icontext";

export class AircraftSelection {

    constructor(private context: IContext) {
        const raptor = document.getElementById("select-raptor");
        raptor.onclick = () => this.onAircraftSelectionChanged("1");
        const spirit = document.getElementById("select-spirit");
        spirit.onclick = () => this.onAircraftSelectionChanged("2");
        const mohawk = document.getElementById("select-mohawk");
        mohawk.onclick = () => this.onAircraftSelectionChanged("3");
        const tornado = document.getElementById("select-tornado");
        tornado.onclick = () => this.onAircraftSelectionChanged("4");
        const prowler = document.getElementById("select-prowler");
        prowler.onclick = () => this.onAircraftSelectionChanged("5");
    }

    private onAircraftSelectionChanged(selection: string) {
        this.context.connection.sendCommand("respawn", selection);
    }
}
