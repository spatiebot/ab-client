import { abWalls } from "../../ab-assets/walls";
import { IContext } from "../../app-context/icontext";
import { Pos } from "../../models/pos";
import { ClippedView } from "../clipped-view";

const MOUNTAIN_BITMAP_SCALE = 1.4;

const MIN_RADIUS_FOR_LARGE = 132;
const MIN_RADIUS_FOR_MEDIUM = 120;
const MIN_RADIUS_FOR_REGULAR = 108;
const MIN_RADIUS_FOR_SMALL = 84;
const MIN_RADIUS_FOR_SMALLER = 60;

declare const constants: any;

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
                if (this.clip.isVisible(pos)) {
                    const clipPos = this.clip.translate(pos);
                    if (count === 0) {
                        context.moveTo(clipPos.x, clipPos.y);
                    } else {
                        context.lineTo(clipPos.x, clipPos.y);
                    }
                    context.stroke();

                    if (count === 1) {
                        context.font = "12px 'Courier New'"
                        context.fillStyle = "white";
                        context.fillText("len: " + path.length, clipPos.x, clipPos.y);
                    }

                    count++;
                }
            }
        }
    }
}
