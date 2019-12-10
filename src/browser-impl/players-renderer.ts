import { SHIPS_SPECS } from "../ab-assets/ships-constants";
import { CTF_TEAMS, PLAYER_STATUS } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { Pos } from "../models/pos";
import { ClippedView } from "./clipped-view";

const COLOR_GREENISH = "rgba(0, 153, 102)";
const COLOR_GREENISH_PROWLER = "rgba(0, 153, 102, 0.6)";
const COLOR_BLUE_TEAM = "rgba(0, 102, 153)";
const COLOR_BLUE_TEAM_PROWLER = "rgba(0, 102, 153, 0.6)";
const COLOR_RED_TEAM = "rgba(153, 60, 60)";
const COLOR_RED_TEAM_PROWLER = "rgba(153, 60, 60, 0.6)";

export class PlayersRenderer {

    constructor(private context: IContext, private clip: ClippedView) {

    }

    public renderPlayers(context: CanvasRenderingContext2D): void {
        context.font = "9pt 'Tahoma'";
        for (const player of this.context.state.getPlayers()) {

            // draw ships as their hit circles for now
            const aircraftSpecs = SHIPS_SPECS[player.type];
            const hitCircles = aircraftSpecs.collisions;

            if (player.status !== PLAYER_STATUS.ALIVE || !player.isVisibleOnScreen) {
                continue;
            }

            const pos = player.mostReliablePos;
            if (!pos || !this.clip.isVisible(pos)) {
                continue;
            }

            if (player.team === CTF_TEAMS.BLUE) {
                context.fillStyle = player.stealthed ? COLOR_BLUE_TEAM_PROWLER : COLOR_BLUE_TEAM;
            } else if (player.team === CTF_TEAMS.RED) {
                context.fillStyle = player.stealthed ? COLOR_RED_TEAM_PROWLER : COLOR_RED_TEAM;
            } else {
                context.fillStyle = player.stealthed ? COLOR_GREENISH_PROWLER : COLOR_GREENISH;
            }
            const clipPos = this.clip.translate(pos);

            context.translate(clipPos.x, clipPos.y);
            context.rotate(player.rot);
            for (const hitCircle of hitCircles) {
                const hitCirclePos = new Pos(this.clip.scale(hitCircle[0]), this.clip.scale(hitCircle[1]));
                const r = this.clip.scale(hitCircle[2]);

                context.beginPath();
                context.arc(hitCirclePos.x, hitCirclePos.y, r, 0, 2 * Math.PI);
                context.fill();
            }
            context.rotate(-player.rot);
            context.translate(-clipPos.x, -clipPos.y);

            // draw name
            context.fillStyle = "black";
            const name = `${player.ranking}. ${player.name} (${Math.floor(player.health * 100)}%)`;
            const nameWidth = context.measureText(name).width;
            context.fillText(name, clipPos.x - nameWidth / 2, clipPos.y + this.clip.scale(60));
        }
    }
}
