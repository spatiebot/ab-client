import { MAP_SIZE } from "../ab-protocol/src/lib";
import { Pos } from "../models/pos";
import { ClippedView } from "./clipped-view";

const GRID_DISTANCE = 100;

export class BackgroundRenderer {
    private backgroundImage: HTMLImageElement;
    constructor(private clip: ClippedView) {
        this.backgroundImage = document.getElementById("map") as HTMLImageElement;
    }

    public renderBackground(context: CanvasRenderingContext2D): void {

        // draw background
        // the background image is twice too small.
        const clipRect = this.clip.getClipRectangle();
        const clipSize = new Pos(clipRect[1].x - clipRect[0].x, clipRect[1].y - clipRect[0].y);
        context.drawImage(this.backgroundImage,
            (MAP_SIZE.WIDTH / 2 + clipRect[0].x) / 2, (MAP_SIZE.HEIGHT / 2 + clipRect[0].y) / 2,
            clipSize.x / 2, clipSize.y / 2,
            0, 0, this.clip.scale(clipSize.x), this.clip.scale(clipSize.y));

        // draw a grid
        context.fillStyle = "silver";
        const gridDistance = this.clip.scale(GRID_DISTANCE);
        for (let y = clipRect[0].y - (clipRect[0].y % gridDistance); y < clipRect[1].y; y += gridDistance) {
            for (let x = clipRect[0].x - (clipRect[0].x % gridDistance); x < clipRect[1].x; x += gridDistance) {
                const pos = this.clip.translate(new Pos(x, y));
                context.fillRect(pos.x, pos.y, 1, 1);
            }
        }
    }
}
