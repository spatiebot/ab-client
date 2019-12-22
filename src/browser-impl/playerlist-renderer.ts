import { FLAGS_CODE_TO_ISO } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { Player } from "../models/player";

export class PlayerListRenderer {

    private listElement: HTMLTableElement;

    constructor(private context: IContext) {
        this.listElement = document.getElementById("player-list") as HTMLTableElement;
    }

    public render(): void {
        this.listElement.innerHTML = "";

        const players = this.context.state.getPlayers();

        players.sort((a: Player, b: Player) => {
            return (b.score || 0) - (a.score || 0);
        });

        let ranking = 1;
        for (const player of players) {
            const row = this.listElement.insertRow();

            const cellPos = row.insertCell();
            cellPos.innerText = `${ranking}.`;

            const cellFlag = row.insertCell();

            const flag = FLAGS_CODE_TO_ISO["" + player.flag];
            if (flag) {
                const flagImage = document.createElement("img") as HTMLImageElement;
                flagImage.src = "flags/" + flag + ".png";
                flagImage.width = 24;
                flagImage.height = 24;
                cellFlag.appendChild(flagImage);
            }

            const cellName = row.insertCell();
            cellName.innerText = player.name;

            const cellScore = row.insertCell();
            cellScore.innerText = `${player.score}`;

            ranking++;
        }
    }
}
