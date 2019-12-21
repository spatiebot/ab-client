import { IContext } from "../app-context/icontext";

export class ApplyUpgrades {

    constructor(private context: IContext) {
        const speed = document.getElementById("select-speed");
        speed.onclick = () => this.onApplyUpgrade("1");
        const defense = document.getElementById("select-defense");
        defense.onclick = () => this.onApplyUpgrade("2");
        const energy = document.getElementById("select-energy");
        energy.onclick = () => this.onApplyUpgrade("3");
        const missile = document.getElementById("select-missile");
        missile.onclick = () => this.onApplyUpgrade("4");
    }

    private onApplyUpgrade(selection: string) {
        this.context.connection.sendCommand("upgrade", selection);
    }
}
