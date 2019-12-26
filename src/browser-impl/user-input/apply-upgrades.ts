import { IContext } from "../../app-context/icontext";

export class ApplyUpgrades {

    constructor(private context: IContext) {
        const speed = document.getElementById("select-speed");
        speed.onclick = () => this.applyUpgrade("1");
        const defense = document.getElementById("select-defense");
        defense.onclick = () => this.applyUpgrade("2");
        const energy = document.getElementById("select-energy");
        energy.onclick = () => this.applyUpgrade("3");
        const missile = document.getElementById("select-missile");
        missile.onclick = () => this.applyUpgrade("4");

        const drop = document.getElementById("drop-upgrade");
        drop.onclick = () => this.dropUpgrade();
    }

    public applyUpgrade(selection: string) {
        this.context.connection.sendCommand("upgrade", selection);
    }

    public dropUpgrade() {
        this.context.connection.sendCommand("upgrades", "drop");
    }
}
