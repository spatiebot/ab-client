import { FLAG_DEFAULT_POSITION } from "../../ab-assets/ctf-constants";
import { CTF_FLAG_STATE, CTF_TEAMS } from "../../ab-protocol/src/lib";
import { IContext } from "../../app-context/icontext";
import { CtfTeam } from "../../models/ctf-team";
import { Pos } from "../../models/pos";
import { ClippedView } from "../clipped-view";

const BLUE_TEAM_COLOR = "navy";
const RED_TEAM_COLOR = "darkred";
const CTF_BASE_SIZE = 120;
const CTF_BASE_HALF_SIZE = CTF_BASE_SIZE / 2;
const CTF_BASE_LINE_WIDTH = 8;

export class FlagRenderer {
    private readonly blueFlag: HTMLImageElement;
    private readonly redFlag: HTMLImageElement;

    constructor(private context: IContext, private clip: ClippedView) {
        this.blueFlag = document.getElementById("blue-flag") as HTMLImageElement;
        this.redFlag = document.getElementById("red-flag") as HTMLImageElement;
    }

    public render(ctx: CanvasRenderingContext2D): void {

        const redTeam = this.context.state.getCtfTeam(CTF_TEAMS.RED);
        const blueTeam = this.context.state.getCtfTeam(CTF_TEAMS.BLUE);

        this.renderFlag(redTeam, this.redFlag, ctx);
        this.renderFlag(blueTeam, this.blueFlag, ctx);

        this.renderBase(ctx, FLAG_DEFAULT_POSITION.blue, BLUE_TEAM_COLOR);
        this.renderBase(ctx, FLAG_DEFAULT_POSITION.red, RED_TEAM_COLOR);
    }

    private renderBase(ctx: CanvasRenderingContext2D, pos: Pos, color: string) {
        const leftUpper = new Pos(pos.x - CTF_BASE_HALF_SIZE, pos.y - CTF_BASE_HALF_SIZE);
        const rightBottom = new Pos(pos.x + CTF_BASE_HALF_SIZE, pos.y + CTF_BASE_HALF_SIZE);
        if (!this.clip.isVisible(leftUpper) && !this.clip.isVisible(rightBottom)) {
            return;
        }

        const scaledBasePos = this.clip.translate(pos);
        const scaledBaseSize = this.clip.scale(CTF_BASE_SIZE);
        const halfBaseSize = scaledBaseSize / 2;
        ctx.strokeStyle = color;
        ctx.lineWidth = this.clip.scale(CTF_BASE_LINE_WIDTH);
        ctx.lineJoin = "round";
        ctx.strokeRect(
            scaledBasePos.x - halfBaseSize, scaledBasePos.y - halfBaseSize,
            scaledBaseSize, scaledBaseSize);
    }

    private renderFlag(team: CtfTeam, flag: HTMLImageElement, ctx: CanvasRenderingContext2D) {
        let pos = team.flagPos;

        if (!pos) {
            return;
        }

        let isFlagVisible: boolean;
        let isFlagBeingCarried = false;
        if (team.flagState === CTF_FLAG_STATE.DYNAMIC) {
            // flag is on the move
            const carrier = this.context.state.getPlayerById(team.flagTakenById);
            if (carrier) {
                pos = carrier.mostReliablePos;
                isFlagVisible = carrier.isVisibleOnScreen && this.clip.isVisible(pos);
                isFlagBeingCarried = true;
            }
        } else {
            isFlagVisible = this.clip.isVisible(pos);
        }

        if (isFlagVisible) {
            const clippedFlagPos = this.clip.translate(pos);
            const scaledWidth = this.clip.scale(flag.width);
            const scaledHeight = this.clip.scale(flag.height);
            ctx.drawImage(flag, 0, 0, flag.width, flag.height,
                clippedFlagPos.x - scaledWidth / 2 + (isFlagBeingCarried ? scaledWidth / 2 : 0),
                clippedFlagPos.y - scaledHeight / 2 - (isFlagBeingCarried ? scaledHeight / 2 : 0),
                scaledWidth, scaledHeight);
        }
    }
}
