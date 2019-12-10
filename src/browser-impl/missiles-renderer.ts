import { IContext } from "../app-context/icontext";
import { ClippedView } from "./clipped-view";

export class MissilesRenderer {
    constructor(private context: IContext, private clip: ClippedView) {

    }

    public renderMissiles(context: CanvasRenderingContext2D) {
        context.fillStyle = "red";
        for (const missile of this.context.state.getMissiles()) {
            const pos = missile.pos;
            if (pos) {
                if (this.clip.isVisible(pos)) {
                    const clipPos = this.clip.translate(pos);
                    context.beginPath();
                    context.arc(clipPos.x, clipPos.y, 4, 0, 2 * Math.PI);
                    context.fill();
                }
            }

        }
    }
}
