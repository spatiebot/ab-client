import { FLAGS_CODE_TO_ISO, PLAYER_STATUS } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { Player } from "../models/player";

export class PlayerListRenderer {

    private listElement: HTMLTableElement;

    constructor(private context: IContext) {
        this.listElement = document.getElementById("player-list") as HTMLTableElement;
    }

    public render(): void {
        const players = this.context.state.getPlayers();

        players.sort((a: Player, b: Player) => {
            return (b.score || 0) - (a.score || 0);
        });

        let ranking = 1;
        for (const player of players) {

            if (player.status === PLAYER_STATUS.INACTIVE && player.name === "Server") {
                continue;
            }

            let row = this.listElement.rows[ranking - 1];
            let cellPos: HTMLTableDataCellElement;
            let cellFlag: HTMLTableDataCellElement;
            let cellName: HTMLTableDataCellElement;
            let cellScore: HTMLTableDataCellElement;
            let flagImage: HTMLImageElement;

            if (row) {
                cellPos = row.cells[0];
                cellFlag = row.cells[1];
                cellName = row.cells[2];
                cellScore = row.cells[3];
                flagImage = cellFlag.firstElementChild as HTMLImageElement;
            } else {
                row = this.listElement.insertRow();
                cellPos = row.insertCell();
                cellFlag = row.insertCell();
                cellName = row.insertCell();
                cellName.className = "playerlist-name";
                cellScore = row.insertCell();

                flagImage = document.createElement("img") as HTMLImageElement;
                flagImage.width = 24;
                flagImage.height = 24;
                cellFlag.appendChild(flagImage);
            }

            row.className = player.status === PLAYER_STATUS.INACTIVE ? "playerlist-player-inactive" : "";

            cellPos.innerText = `${ranking}.`;

            const flag = FLAGS_CODE_TO_ISO["" + player.flag] || "JOLLY";

            flagImage.src = "flags/" + flag + ".png";

            cellName.innerText = player.name;
            cellScore.innerText = `${player.score}`;

            ranking++;
        }

        while (this.listElement.rows[ranking - 1]) {
            const row = this.listElement.rows[ranking - 1];
            row.remove();
        }
    }
}
