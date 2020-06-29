import { SHIPS_SPECS, SHIPS_TYPES } from "../../ab-assets/ships-constants";
import { COUNTRY_NAMES, CTF_TEAMS, FLAGS_CODE_TO_ISO, PLAYER_STATUS } from "../../ab-protocol/src/lib";
import { IContext } from "../../app-context/icontext";
import { StopWatch } from "../../helpers/stopwatch";
import { Player } from "../../models/player";
import { Pos } from "../../models/pos";
import { ClippedView } from "../clipped-view";

// health/energy colors
const HEALTH_ENERGY_BARS_RADIUS = 75;
const HEALTH_ENERGY_BARS_WIDTH = 8;
const SHIELD_INFERNO_BARS_WIDTH = 2 * HEALTH_ENERGY_BARS_WIDTH;

const SHIELD_INFERNO_RADIUS = HEALTH_ENERGY_BARS_RADIUS
    - (HEALTH_ENERGY_BARS_WIDTH / 2)
    - (SHIELD_INFERNO_BARS_WIDTH / 2);

const FLAG_WIDTH = 24;
const FLAG_MARGIN_LEFT = 10;
const FONT_SIZE = 11;
const FLAG_PADDING_TOP = 4; // diff between length and width / 2

const SAY_MARGIN = 20;
const SAY_HEIGHT = 40;
const SAY_DURATION_SECONDS = 5;
const SAY_DISTANCE_FROM_AIRCRAFT = 80;

const INVISIBLE_PROWLER_BLUR_WIDTH = 10;
const PROWLER_RADAR_CIRCLE_RADIUS = 300;

declare const constants: any;

export class PlayersRenderer {

    private images: {
        raptor: HTMLImageElement,
        spirit: HTMLImageElement,
        mohawk: HTMLImageElement,
        tornado: HTMLImageElement,
        prowler: HTMLImageElement,
    };

    private flagImages: any = {};

    private saysToSay: { playerId: number, msg: string, sw: StopWatch }[] = [];

    constructor(private context: IContext, private clip: ClippedView) {
        this.images = {
            mohawk: document.getElementById("mohawk") as HTMLImageElement,
            prowler: document.getElementById("prowler") as HTMLImageElement,
            raptor: document.getElementById("raptor") as HTMLImageElement,
            spirit: document.getElementById("spirit") as HTMLImageElement,
            tornado: document.getElementById("tornado") as HTMLImageElement,
        };
    }

    public addSay(playerId: number, msg: string) {
        this.saysToSay.push({ playerId, msg, sw: new StopWatch() });
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

            if (player.status === PLAYER_STATUS.INACTIVE) {
                continue;
            }

            const pos = player.mostReliablePos;
            const isInViewPort = pos && this.clip.isVisible(pos);

            const isInvisibleProwler = player.type === SHIPS_TYPES.PROWLER &&
                (isInViewPort && !player.isVisibleOnScreen ||
                    player.stealthed && player.team !== this.context.state.team);

            if (!player.isVisibleOnScreen && !isInvisibleProwler) {
                continue;
            }

            const clipPos = this.clip.translate(pos);

            // move & rotate canvas to render the aircraft
            context.translate(clipPos.x, clipPos.y);

            if (!isInvisibleProwler) {
                context.rotate(player.rot);
            } else {
                // don't rotate invisible prowlers, because we don't know their rotation
                // but do blur them to indicate this is prowler radar
                context.filter = `blur(${INVISIBLE_PROWLER_BLUR_WIDTH}px)`;
            }

            this.renderAircraft(player, context, isInvisibleProwler);

            if (!isInvisibleProwler) {
                // rotate back and render bars
                context.rotate(-player.rot);
                this.renderBars(context, player);
            } else {
                context.filter = "none";
            }

            // draw name + flag
            this.renderName(player, context,
                scaledFlagWidth, scaledFlagMarginLeft, scaledFontSize, scaledFlagPaddingTop);

            // render text bubble
            this.renderTextBubble(player, context);

            // restore canvas
            context.translate(-clipPos.x, -clipPos.y);
        }
    }

    private renderTextBubble(player: Player, context: CanvasRenderingContext2D) {
        for (const say of this.saysToSay) {
            if (say.playerId === player.id) {
                context.fillStyle = constants.PLAYER_SAY_BACKGROUND_COLOR;
                const textWidth = context.measureText(say.msg).width;
                const sayLeft = textWidth / 2;
                const sayTop = -this.clip.scale(SAY_DISTANCE_FROM_AIRCRAFT);
                const sayMargin = this.clip.scale(SAY_MARGIN);
                const sayHeight = this.clip.scale(SAY_HEIGHT);
                context.fillRect(-sayLeft - sayMargin, sayTop - sayMargin,
                    textWidth + sayMargin * 2, sayHeight);
                context.fillStyle = constants.PLAYER_SAY_FOREGROUND_COLOR;
                context.fillText(say.msg, -sayLeft, sayTop);
            }
        }
        this.saysToSay = this.saysToSay.filter((x) => x.sw.elapsedSeconds < SAY_DURATION_SECONDS);
    }

    private renderName(
        player: Player,
        context: CanvasRenderingContext2D,
        scaledFlagWidth: number,
        scaledFlagMarginLeft: number,
        scaledFontSize: number,
        scaledFlagPaddingTop: number) {

        let nameColor = this.context.settings.useBitmaps ?
            constants.PLAYER_NAME_COLOR : constants.PLAYER_NAME_NOBITMAP_COLOR;
        if (player.team === CTF_TEAMS.BLUE) {
            nameColor = constants.PLAYER_NAME_BLUE_TEAM_COLOR;
        } else if (player.team === CTF_TEAMS.RED) {
            nameColor = constants.PLAYER_NAME_RED_TEAM_COLOR;
        }
        context.fillStyle = nameColor;

        let levelPostfix = "";
        if (player.level) {
            levelPostfix = ` [${player.level}]`;
        }

        const name = `${player.ranking || "?"}. ${player.name}${levelPostfix}`;
        const flagSpace = this.context.settings.useBitmaps ? scaledFlagWidth + scaledFlagMarginLeft : 0;
        const nameWidth = context.measureText(name).width + flagSpace;
        const left = - nameWidth / 2;
        const top = this.clip.scale(70);

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
        context.fillStyle = constants.PLAYER_STATS_COLOR;
        const stats2 = `Score: ${player.score}; ping: ${player.ping || "?"} ms`;
        context.fillText(stats2, left, top + lineHeight);
    }

    private renderBars(context: CanvasRenderingContext2D, player: Player) {

        context.strokeStyle = constants.PLAYER_HEALTH_OK_COLOR;
        if (player.health < 0.3) {
            context.strokeStyle = constants.PLAYER_HEALTH_DANGER_COLOR;
        } else if (player.health < 0.6) {
            context.strokeStyle = constants.PLAYER_HEALTH_WARN_COLOR;
        }

        const r = this.clip.scale(HEALTH_ENERGY_BARS_RADIUS);

        context.lineWidth = this.clip.scale(HEALTH_ENERGY_BARS_WIDTH);
        context.globalAlpha = player.id === this.context.state.id ? 0.8 : 0.5;

        context.beginPath();
        context.arc(0, 0, r, Math.PI, Math.PI + (Math.PI * player.health / 2));
        context.stroke();

        context.strokeStyle = constants.PLAYER_ENERGY_COLOR;
        context.beginPath();
        const energy = Math.max(0.01, player.energy);
        context.arc(0, 0, r, 0, Math.PI * 2 - Math.PI * energy / 2, true);
        context.stroke();

        if (player.powerUps.inferno || player.powerUps.shield) {
            context.strokeStyle = player.powerUps.shield ?
                constants.PLAYER_SHIELD_COLOR : constants.PLAYER_INFERNO_COLOR;
            context.beginPath();
            const duration = !player.shieldOrInfernoTimer ? 1 :
                Math.max(0.01, 1 - player.shieldOrInfernoTimer.timeoutFraction);

            context.lineWidth = this.clip.scale(SHIELD_INFERNO_BARS_WIDTH);
            const shieldR = this.clip.scale(SHIELD_INFERNO_RADIUS);
            context.arc(0, 0, shieldR, Math.PI, Math.PI + (Math.PI * duration));
            context.stroke();
        }

        context.globalAlpha = 1;
    }

    private renderAircraft(player: Player, context: CanvasRenderingContext2D, isInvisibleProwler: boolean) {

        const aircraftSpecs = SHIPS_SPECS[player.type];

        if (isInvisibleProwler) {
            context.fillStyle =
                player.team === CTF_TEAMS.BLUE ? constants.PLAYER_NOBITMAP_BLUE_TEAM_PROWLER_COLOR :
                    player.team === CTF_TEAMS.RED ? constants.PLAYER_NOBITMAP_RED_TEAM_PROWLER_COLOR :
                        constants.PLAYER_NOBITMAP_PROWLER_COLOR;
            const r = this.clip.scale(PROWLER_RADAR_CIRCLE_RADIUS);
            context.beginPath();
            context.arc(0, 0, r, 0, 2 * Math.PI);
            context.fill();
        } else if (this.context.settings.useBitmaps) {
            const image: HTMLImageElement = this.images[aircraftSpecs.name];
            const imageScale = 1; // used to have larger images before
            const targetWidth = this.clip.scale(image.width * imageScale);
            const targetHeight = this.clip.scale(image.height * imageScale);
            const actionX = targetWidth / 2;
            const actionY = targetHeight / 2;

            if (player.stealthed) {
                // make prowler a ghost if stealthed
                context.globalAlpha = 0.4;
            }
            context.drawImage(image, 0, 0, image.width, image.height, -actionX, -actionY, targetWidth, targetHeight);

            context.globalAlpha = 1;

        } else {
            if (player.team === CTF_TEAMS.BLUE) {
                context.fillStyle = player.stealthed ?
                    constants.PLAYER_NOBITMAP_BLUE_TEAM_PROWLER_COLOR : constants.PLAYER_NOBITMAP_BLUE_TEAM_COLOR;
            } else if (player.team === CTF_TEAMS.RED) {
                context.fillStyle = player.stealthed ?
                    constants.PLAYER_NOBITMAP_RED_TEAM_PROWLER_COLOR : constants.PLAYER_NOBITMAP_RED_TEAM_COLOR;
            } else {
                context.fillStyle = player.stealthed ?
                    constants.PLAYER_NOBITMAP_PROWLER_COLOR : constants.PLAYER_NOBITMAP_COLOR;
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
    }

    private initFlagImages() {
        for (const flag of Object.keys(COUNTRY_NAMES)) {
            this.flagImages[flag] = document.getElementById(`flag-${flag}`);
        }
    }
}
