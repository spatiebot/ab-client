import { CTF_TEAMS, FLAGS_CODE_TO_ISO, PLAYER_STATUS } from "../../ab-protocol/src/lib";
import { IContext } from "../../app-context/icontext";
import { Player } from "../../models/player";

export class PlayerListRenderer {

    private listElement: HTMLTableElement;

    constructor(private context: IContext) {
        this.listElement = document.getElementById("player-list") as HTMLTableElement;
    }

    public render(): void {
        const players = this.context.state.getPlayers();

        players.sort((a: Player, b: Player) => {
            const ar = a.ranking || Number.MAX_SAFE_INTEGER;
            const br = b.ranking || Number.MAX_SAFE_INTEGER;
            return ar - br;
        });

        let rowCount = 0;
        for (const player of players) {

            if (player.status === PLAYER_STATUS.INACTIVE && player.name === "Server") {
                continue;
            }

            let row = this.listElement.rows[rowCount];
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
                cellPos.className = "playerlist-pos";
                cellFlag = row.insertCell();
                cellFlag.className = "playerlist-flag";
                cellName = row.insertCell();
                cellName.className = "playerlist-name";
                cellScore = row.insertCell();
                cellScore.className = "playerlist-score";

                flagImage = document.createElement("img") as HTMLImageElement;
                flagImage.width = 24;
                flagImage.height = 24;
                cellFlag.appendChild(flagImage);
            }

            row.className = player.status === PLAYER_STATUS.INACTIVE ? "playerlist-player-inactive" : "";

            if (player.team === CTF_TEAMS.BLUE) {
                row.className += " playerlist-team-blue";
            } else if (player.team === CTF_TEAMS.RED) {
                row.className += " playerlist-team-red";
            }

            const ranking = player.ranking || rowCount;
            cellPos.innerText = `${ranking}. `;

            const flag = FLAGS_CODE_TO_ISO["" + player.flag] || "JOLLY";

            flagImage.src = "flags/" + flag + ".png";

            cellName.innerText = player.name;
            cellScore.innerText = `${player.score}`;

            rowCount++;
        }

        while (this.listElement.rows[rowCount]) {
            const row = this.listElement.rows[rowCount];
            row.remove();
        }
    }
}
