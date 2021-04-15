import { IContext } from "../../app-context/icontext";
import { ClippedView } from "../clipped-view";

export class PathRenderer {

    constructor(private clip: ClippedView, private context: IContext) {
    }

    public renderPath(context: CanvasRenderingContext2D) {
        const path = this.context.botstate.path;
        if (path && path.length > 0) {
            let count = 0;
            context.strokeStyle = "orange";
            context.lineWidth = 2;
            context.beginPath();

            for (const pos of path) {
                const clipPos = this.clip.translate(pos);
                if (count === 0) {
                    context.moveTo(clipPos.x, clipPos.y);
                } else {
                    context.lineTo(clipPos.x, clipPos.y);
                }
                context.stroke();

                if (count === 1) {
                    context.font = "16px 'Courier New'"
                    context.fillStyle = "white";
                    context.fillText("dist: " + this.context.botstate.distanceToTarget, clipPos.x, clipPos.y);
                }

                count++;
            }
        }
    }
}
