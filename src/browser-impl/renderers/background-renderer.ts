import { MAP_SIZE } from "../../ab-protocol/src/lib";
import { IContext } from "../../app-context/icontext";
import { Pos } from "../../models/pos";
import { ClippedView } from "../clipped-view";

declare const constants: any;

const GRID_DISTANCE = 100;
// the background image is 4x too small for performance reasons
const MAP_SCALE = .25;

export class BackgroundRenderer {
    private backgroundImage: HTMLImageElement;
    constructor(private clip: ClippedView, private context: IContext) {
        this.backgroundImage = document.getElementById("map") as HTMLImageElement;
    }

    public renderBackground(context: CanvasRenderingContext2D): void {

        const clipRect = this.clip.getClipRectangle();

        // draw background if using bitmaps only
        if (this.context.settings.useBitmaps) {
            const clipSize = new Pos(clipRect[1].x - clipRect[0].x, clipRect[1].y - clipRect[0].y);
            context.drawImage(this.backgroundImage,
                (MAP_SIZE.WIDTH / 2 + clipRect[0].x) * MAP_SCALE, (MAP_SIZE.HEIGHT / 2 + clipRect[0].y) * MAP_SCALE,
                clipSize.x * MAP_SCALE, clipSize.y * MAP_SCALE,
                0, 0, this.clip.scale(clipSize.x), this.clip.scale(clipSize.y));
        }

        // draw a grid
        context.fillStyle = constants.BACKGROUND_GRID_COLOR;
        const gridDistance = this.clip.scale(GRID_DISTANCE);
        for (let y = clipRect[0].y - (clipRect[0].y % gridDistance); y < clipRect[1].y; y += gridDistance) {
            for (let x = clipRect[0].x - (clipRect[0].x % gridDistance); x < clipRect[1].x; x += gridDistance) {
                const pos = this.clip.translate(new Pos(x, y));
                context.fillRect(pos.x, pos.y, 1, 1);
            }
        }
    }
}
