import { CTF_FLAG_STATE, CTF_TEAMS, GAME_TYPES, MAP_SIZE, PLAYER_STATUS } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { CtfTeam } from "../models/ctf-team";
import { Pos } from "../models/pos";

const MARKER_SIZE = 3;
const MY_RECT_WIDTH = 20;
const MY_RECT_HEIGHT = 10;
const HALF_MAP_WIDTH = MAP_SIZE.WIDTH / 2;
const HALF_MAP_HEIGHT = MAP_SIZE.HEIGHT / 2;

export class MinimapRenderer {

    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private readonly blueFlag: HTMLImageElement;
    private readonly redFlag: HTMLImageElement;

    constructor(private context: IContext) {
        this.canvas = document.getElementById("minimap-canvas") as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext("2d");
        this.blueFlag = document.getElementById("blue-flag") as HTMLImageElement;
        this.redFlag = document.getElementById("red-flag") as HTMLImageElement;
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
                this.canvasContext.strokeStyle = "white";
                this.canvasContext.strokeRect(
                    pos.x - MY_RECT_WIDTH / 2, pos.y - MY_RECT_HEIGHT / 2,
                    MY_RECT_WIDTH, MY_RECT_HEIGHT);
            } else {
                let fillStyle = "darkred";
                if (player.team === CTF_TEAMS.BLUE) {
                    fillStyle = "navy";
                }
                switch (player.ranking) {
                    case 1:
                        fillStyle = "gold";
                        break;
                    case 2:
                        fillStyle = "silver";
                        break;
                    case 3:
                        fillStyle = "orange";
                        break;
                }

                this.canvasContext.fillStyle = fillStyle;
                this.canvasContext.beginPath();
                this.canvasContext.arc(pos.x, pos.y, MARKER_SIZE, 0, 2 * Math.PI);
                this.canvasContext.fill();
            }
        }

        if (this.context.gameType === GAME_TYPES.CTF) {

            const redTeam = this.context.state.getCtfTeam(CTF_TEAMS.RED);
            const blueTeam = this.context.state.getCtfTeam(CTF_TEAMS.BLUE);

            this.renderFlag(redTeam, this.redFlag, this.canvasContext);
            this.renderFlag(blueTeam, this.blueFlag, this.canvasContext);
        }
    }

    private renderFlag(team: CtfTeam, flag: HTMLImageElement, ctx: CanvasRenderingContext2D) {
        let pos = team.flagPos;
        if (team.flagState === CTF_FLAG_STATE.DYNAMIC) {
            // flag is on the move
            const carrier = this.context.state.getPlayerById(team.flagTakenById);
            if (carrier) {
                pos = carrier.mostReliablePos;
            }
        }

        const scaleX = this.canvas.width / MAP_SIZE.WIDTH;
        const scaleY = this.canvas.height / MAP_SIZE.HEIGHT;

        const scaledWidth = flag.width * scaleX;
        const scaledHeight = flag.height * scaleY;
        const scaledPos = new Pos(
            (pos.x + HALF_MAP_WIDTH) * scaleX,
            (pos.y + HALF_MAP_HEIGHT) * scaleY);

        ctx.drawImage(flag, 0, 0, flag.width, flag.height,
            scaledPos.x - 5, scaledPos.y - 5, 10, 11);
    }
}
