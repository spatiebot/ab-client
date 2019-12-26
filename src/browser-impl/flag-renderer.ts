import { CTF_FLAG_STATE, CTF_TEAMS } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { CtfTeam } from "../models/ctf-team";
import { ClippedView } from "./clipped-view";

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
                clippedFlagPos.x - scaledWidth / 2,
                clippedFlagPos.y - scaledHeight / 2 - (isFlagBeingCarried ? scaledHeight / 2 : 0),
                scaledWidth, scaledHeight);
        }
    }
}
