import { PLAYER_STATUS } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { ClippedView } from "./clipped-view";

export class PlayersRenderer {

    constructor(private context: IContext, private clip: ClippedView) {

    }

    public renderPlayers(context: CanvasRenderingContext2D): void {
        context.font = "8pt serif";
        for (const player of this.context.state.getPlayers()) {
            const name = "[" + player.name + "," + player.id + "]";

            if (player.status === PLAYER_STATUS.ALIVE) {
                let pos = player.pos;
                if (!player.isVisibleOnScreen || player.stealthed || !pos) {
                    pos = player.lowResPos;
                }
                if (pos) {
                    if (this.clip.isVisible(pos)) {
                        const clipPos = this.clip.translate(pos);
                        context.fillStyle = "navy";
                        context.fillText(name, clipPos.x, clipPos.y);
                    }
                }
            }
        }
    }
}
