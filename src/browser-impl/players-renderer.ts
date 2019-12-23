import { SHIPS_SPECS } from "../ab-assets/ships-constants";
import { COUNTRY_NAMES, CTF_TEAMS, FLAGS_CODE_TO_ISO, PLAYER_STATUS } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { Pos } from "../models/pos";
import { ClippedView } from "./clipped-view";

const COLOR_GREENISH = "rgba(0, 153, 102)";
const COLOR_GREENISH_PROWLER = "rgba(0, 153, 102, 0.6)";
const COLOR_BLUE_TEAM = "rgba(0, 102, 153)";
const COLOR_BLUE_TEAM_PROWLER = "rgba(0, 102, 153, 0.6)";
const COLOR_RED_TEAM = "rgba(153, 60, 60)";
const COLOR_RED_TEAM_PROWLER = "rgba(153, 60, 60, 0.6)";

const FLAG_WIDTH = 24;
const FLAG_MARGIN_LEFT = 10;
const FONT_SIZE = 11;
const FLAG_PADDING_TOP = 4; // diff between length and width / 2

export class PlayersRenderer {

    private images: {
        raptor: HTMLImageElement,
        spirit: HTMLImageElement,
        mohawk: HTMLImageElement,
        tornado: HTMLImageElement,
        prowler: HTMLImageElement,
    };

    private flagImages: any = {};

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

        const scaledFontSize = this.clip.scale(FONT_SIZE);
        context.font = scaledFontSize + "pt 'Tahoma'";
        const scaledFlagWidth = this.clip.scale(FLAG_WIDTH);
        const scaledFlagPaddingTop = this.clip.scale(FLAG_PADDING_TOP);
        const scaledFlagMarginLeft = this.clip.scale(FLAG_MARGIN_LEFT);

        if (!this.flagImages.JOLLY) {
            this.initFlagImages();
        }

        for (const player of this.context.state.getPlayers()) {

            if (player.status !== PLAYER_STATUS.ALIVE || !player.isVisibleOnScreen) {
                continue;
            }

            const pos = player.mostReliablePos;
            if (!pos || !this.clip.isVisible(pos)) {
                continue;
            }

            const clipPos = this.clip.translate(pos);

            context.translate(clipPos.x, clipPos.y);
            context.rotate(player.rot);

            const aircraftSpecs = SHIPS_SPECS[player.type];

            // render image or hitcircles, depending on the setting
            if (this.context.settings.useBitmaps) {
                const image: HTMLImageElement = this.images[aircraftSpecs.name];
                const imageScale = 0.8;
                const targetWidth = this.clip.scale(image.width * imageScale);
                const targetHeight = this.clip.scale(image.height * imageScale);

                if (player.stealthed) {
                    // make prowler a ghost if stealthed
                    context.globalAlpha = 0.4;
                }

                context.drawImage(image, 0, 0, image.width, image.height,
                    -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);

                context.globalAlpha = 1;
            } else {

                if (player.team === CTF_TEAMS.BLUE) {
                    context.fillStyle = player.stealthed ? COLOR_BLUE_TEAM_PROWLER : COLOR_BLUE_TEAM;
                } else if (player.team === CTF_TEAMS.RED) {
                    context.fillStyle = player.stealthed ? COLOR_RED_TEAM_PROWLER : COLOR_RED_TEAM;
                } else {
                    context.fillStyle = player.stealthed ? COLOR_GREENISH_PROWLER : COLOR_GREENISH;
                }

                const hitCircles = aircraftSpecs.collisions;
                for (const hitCircle of hitCircles) {
                    const hitCirclePos = new Pos(this.clip.scale(hitCircle[0]), this.clip.scale(hitCircle[1]));
                    const r = this.clip.scale(hitCircle[2]);

                    context.beginPath();
                    context.arc(hitCirclePos.x, hitCirclePos.y, r, 0, 2 * Math.PI);
                    context.fill();
                }

            }

            context.rotate(-player.rot);
            context.translate(-clipPos.x, -clipPos.y);

            // draw name + flag
            context.fillStyle = this.context.settings.useBitmaps ? "white" : "black";
            const name = `${player.ranking || "?"}. ${player.name}`;

            const flagSpace = this.context.settings.useBitmaps ? scaledFlagWidth + scaledFlagMarginLeft : 0;

            const nameWidth = context.measureText(name).width + flagSpace;
            const left = clipPos.x - nameWidth / 2;
            const top = clipPos.y + this.clip.scale(60);
            context.fillText(name, left, top);

            if (this.context.settings.useBitmaps) {
                const flag = FLAGS_CODE_TO_ISO["" + player.flag] || "JOLLY";
                const flagImage = this.flagImages[flag] as HTMLImageElement;
                context.drawImage(flagImage, 0, 0, FLAG_WIDTH, FLAG_WIDTH,
                    left + nameWidth - scaledFlagWidth, top - scaledFlagWidth + scaledFontSize - scaledFlagPaddingTop,
                    scaledFlagWidth, scaledFlagWidth);
            }

            // draw stats
            const lineHeight = this.clip.scale(20);
            context.fillStyle = "silver";
            const stats1 = `Health: ${Math.floor(player.health * 100)}%;`;
            context.fillText(stats1, left, top + lineHeight);
            const stats2 = `Score: ${player.score}`;
            context.fillText(stats2, left, top + lineHeight * 2);
        }
    }

    private initFlagImages() {
        for (const flag of Object.keys(COUNTRY_NAMES)) {
            this.flagImages[flag] = document.getElementById(`flag-${flag}`);
        }
    }
}
