import { MAP_SIZE } from "../ab-protocol/src/lib";
import { Pos } from "../models/pos";
import { ClippedView } from "./clipped-view";

const GRID_DISTANCE = 100;

export class BackgroundRenderer {
    private backgroundImage: HTMLCanvasElement;
    constructor(private clip: ClippedView) {
        this.backgroundImage = document.getElementById("map") as HTMLCanvasElement;
    }

    public renderBackground(context: CanvasRenderingContext2D): void {

        // draw background
        const clipRect = this.clip.getClipRectangle();

        // const left = this.clip.scale(MAP_SIZE.WIDTH / 2 + clipRect[0].x);
        // const top = this.clip.scale(MAP_SIZE.HEIGHT / 2 + clipRect[0].y);

        // draw a grid
        context.fillStyle = "black";
        const gridDistance = this.clip.scale(GRID_DISTANCE);
        for (let y = clipRect[0].y - (clipRect[0].y % gridDistance); y < clipRect[1].y; y += gridDistance) {
            for (let x = clipRect[0].x - (clipRect[0].x % gridDistance); x < clipRect[1].x; x += gridDistance) {
                const pos = this.clip.translate(new Pos(x, y));
                context.fillRect(pos.x, pos.y, 1, 1);
            }
        }
    }
}
