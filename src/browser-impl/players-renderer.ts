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

    private images: {
        raptor: HTMLImageElement,
        spirit: HTMLImageElement,
        mohawk: HTMLImageElement,
        tornado: HTMLImageElement,
        prowler: HTMLImageElement,
    };

    constructor(private context: IContext, private clip: ClippedView) {
        this.images = {
            mohawk: document.getElementById("mohawk") as HTMLImageElement,
            prowler: document.getElementById("prowler") as HTMLImageElement,
            raptor: document.getElementById("raptor") as HTMLImageElement,
            spirit: document.getElementById("spirit") as HTMLImageElement,
            tornado: document.getElementById("tornado") as HTMLImageElement,
        };
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
            // for (const hitCircle of hitCircles) {
            //     const hitCirclePos = new Pos(this.clip.scale(hitCircle[0]), this.clip.scale(hitCircle[1]));
            //     const r = this.clip.scale(hitCircle[2]);

            //     context.beginPath();
            //     context.arc(hitCirclePos.x, hitCirclePos.y, r, 0, 2 * Math.PI);
            //     context.fill();
            // }
            const image: HTMLImageElement = this.images[aircraftSpecs.name];
            const imageScale = 0.8;
            const targetWidth = this.clip.scale(image.width * imageScale);
            const targetHeight = this.clip.scale(image.height * imageScale);

            context.drawImage(image, 0, 0, image.width, image.height,
                -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);
            context.rotate(-player.rot);
            context.translate(-clipPos.x, -clipPos.y);

            // draw name
            context.fillStyle = "white";
            const name = `${player.ranking}. ${player.name}`;
            const nameWidth = context.measureText(name).width;
            const left = clipPos.x - nameWidth / 2;
            const top = clipPos.y + this.clip.scale(60);
            context.fillText(name, left, top);

            // draw stats
            const lineHeight = this.clip.scale(20);
            context.fillStyle = "silver";
            const stats1 = `Health: ${Math.floor(player.health * 100)}%;`;
            context.fillText(stats1, left, top + lineHeight);
            const stats2 = `Score: ${player.score}`;
            context.fillText(stats2, left, top + lineHeight * 2);

            // upgrades are not detected well yet
            // const stats3 = `Upgr: ${player.upgrades.available}, S${player.upgrades.speed} ` +
            //     `D${player.upgrades.defense} E${player.upgrades.energy} M${player.upgrades.missile}`;
            // context.fillText(stats3, left, top + lineHeight * 3);
        }
    }
}
