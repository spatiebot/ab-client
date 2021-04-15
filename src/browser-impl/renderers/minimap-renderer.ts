import { FLAG_DEFAULT_POSITION } from "../../ab-assets/ctf-constants";
import { CTF_FLAG_STATE, CTF_TEAMS, GAME_TYPES, MAP_SIZE, PLAYER_STATUS } from "../../ab-protocol/src/lib";
import { IContext } from "../../app-context/icontext";
import { CtfTeam } from "../../models/ctf-team";
import { IPos } from "../../models/ipos";
import { Pos } from "../../models/pos";

const MARKER_SIZE = 3;
const MY_RECT_WIDTH = 15;
const MY_RECT_HEIGHT = 10;

const HALF_MAP_WIDTH = MAP_SIZE.WIDTH / 2;
const HALF_MAP_HEIGHT = MAP_SIZE.HEIGHT / 2;

const CTF_BASE_SIZE = 4;
const CTF_FLAG_SIZE = 10;

const HIGHLIGH_SIZE = 2 * MARKER_SIZE;

declare const constants: any;

export class MinimapRenderer {

    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private readonly blueFlag: HTMLImageElement;
    private readonly redFlag: HTMLImageElement;

    private playerToHighlight: number;

    constructor(private context: IContext) {
        this.canvas = document.getElementById("minimap-canvas") as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext("2d");
        this.blueFlag = document.getElementById("blue-flag") as HTMLImageElement;
        this.redFlag = document.getElementById("red-flag") as HTMLImageElement;
    }

    public highlight(playerId: number) {
        this.playerToHighlight = playerId;
    }

    public render(): void {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const scaleX = this.canvas.width / MAP_SIZE.WIDTH;
        const scaleY = this.canvas.height / MAP_SIZE.HEIGHT;

        const myId = this.context.state.id;

        for (const player of this.context.state.getPlayers()) {
            if (player.status === PLAYER_STATUS.INACTIVE) {
                continue;
            }

            const pos = new Pos(
                (player.mostReliablePos.x + HALF_MAP_WIDTH) * scaleX,
                (player.mostReliablePos.y + HALF_MAP_HEIGHT) * scaleY);

            if (player.id === myId) {
                this.canvasContext.strokeStyle = constants.MINIMAP_HIGHLIGHT_COLOR;
                this.canvasContext.strokeRect(
                    pos.x - MY_RECT_WIDTH / 2, pos.y - MY_RECT_HEIGHT / 2,
                    MY_RECT_WIDTH, MY_RECT_HEIGHT);
            } else {
                let fillStyle = constants.MINIMAP_FFA_PLAYER_COLOR;
                if (player.team === CTF_TEAMS.BLUE) {
                    fillStyle = constants.CTF_BLUE_TEAM_COLOR;
                } else if (player.team === CTF_TEAMS.RED) {
                    fillStyle = constants.CTF_RED_TEAM_COLOR;
                }
                switch (player.ranking) {
                    case 1:
                        fillStyle = constants.MINIMAP_PLAYER_1_COLOR;
                        break;
                    case 2:
                        fillStyle = constants.MINIMAP_PLAYER_2_COLOR;
                        break;
                    case 3:
                        fillStyle = constants.MINIMAP_PLAYER_3_COLOR;
                        break;
                }

                this.canvasContext.fillStyle = fillStyle;
                this.canvasContext.beginPath();
                this.canvasContext.arc(pos.x, pos.y, MARKER_SIZE, 0, 2 * Math.PI);
                this.canvasContext.fill();

                if (player.id === this.playerToHighlight) {
                    this.canvasContext.strokeStyle = constants.MINIMAP_HIGHLIGHT_COLOR;
                    this.canvasContext.beginPath();
                    this.canvasContext.arc(pos.x, pos.y, HIGHLIGH_SIZE, 0, 2 * Math.PI);
                    this.canvasContext.stroke();
                }
            }
        }

        if (this.context.gameType === GAME_TYPES.CTF) {

            const redTeam = this.context.state.getCtfTeam(CTF_TEAMS.RED);
            const blueTeam = this.context.state.getCtfTeam(CTF_TEAMS.BLUE);

            this.renderFlag(redTeam, this.redFlag, this.canvasContext,
                FLAG_DEFAULT_POSITION.red, constants.CTF_RED_TEAM_COLOR);
            this.renderFlag(blueTeam, this.blueFlag, this.canvasContext,
                FLAG_DEFAULT_POSITION.blue, constants.CTF_BLUE_TEAM_COLOR);
        }
    }

    private renderFlag(
        team: CtfTeam, flag: HTMLImageElement,
        ctx: CanvasRenderingContext2D, basePos: IPos, color: string) {

        let pos = team.flagPos;

        if (!pos) {
            return;
        }

        if (team.flagState === CTF_FLAG_STATE.DYNAMIC) {
            // flag is on the move
            const carrier = this.context.state.getPlayerById(team.flagTakenById);
            if (carrier) {
                pos = carrier.mostReliablePos;
            }
        }

        const scaleX = this.canvas.width / MAP_SIZE.WIDTH;
        const scaleY = this.canvas.height / MAP_SIZE.HEIGHT;

        const scaledPos = new Pos(
            (pos.x + HALF_MAP_WIDTH) * scaleX,
            (pos.y + HALF_MAP_HEIGHT) * scaleY);

        const ctfFlagHeight = (CTF_FLAG_SIZE / flag.width) * flag.height;

        ctx.drawImage(flag, 0, 0, flag.width, flag.height,
            scaledPos.x - CTF_FLAG_SIZE / 2, scaledPos.y - ctfFlagHeight / 2, CTF_FLAG_SIZE, ctfFlagHeight);

        if (!pos.equals(basePos)) {
            const scaledBasePos = new Pos(
                (basePos.x + HALF_MAP_WIDTH) * scaleX,
                (basePos.y + HALF_MAP_HEIGHT) * scaleY);
            this.canvasContext.strokeStyle = color;
            this.canvasContext.strokeRect(
                scaledBasePos.x - CTF_BASE_SIZE / 2, scaledBasePos.y - CTF_BASE_SIZE / 2,
                CTF_BASE_SIZE, CTF_BASE_SIZE);
        }
    }
}
