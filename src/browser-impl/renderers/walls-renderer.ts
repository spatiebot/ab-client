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

const wallColor = "darkgreen";

export class WallsRenderer {

    private wallImages: {
        [wallNum: number]: HTMLImageElement,
    };

    constructor(private clip: ClippedView, private context: IContext) {
        const medium = document.getElementById("mountain-medium") as HTMLImageElement;
        const large = document.getElementById("mountain-large") as HTMLImageElement;

        const regular = [];
        regular.push(document.getElementById("mountain-regular-a") as HTMLImageElement);
        regular.push(document.getElementById("mountain-regular-b") as HTMLImageElement);
        regular.push(document.getElementById("mountain-regular-c") as HTMLImageElement);

        const small = document.getElementById("mountain-small") as HTMLImageElement;
        const smaller = document.getElementById("mountain-smaller") as HTMLImageElement;
        const mini = document.getElementById("mountain-mini") as HTMLImageElement;

        // assign images to each wall
        let wallNum = 0;
        this.wallImages = {};
        for (const wall of abWalls) {
            const radius = wall[2];
            let img: HTMLImageElement;
            if (radius >= MIN_RADIUS_FOR_LARGE) {
                img = large;
            } else if (radius >= MIN_RADIUS_FOR_MEDIUM) {
                img = medium;
            } else if (radius >= MIN_RADIUS_FOR_REGULAR) {
                img = regular[wallNum % regular.length];
            } else if (radius >= MIN_RADIUS_FOR_SMALL) {
                img = small;
            } else if (radius >= MIN_RADIUS_FOR_SMALLER) {
                img = smaller;
            } else {
                img = mini;
            }

            wall[3] = wallNum;
            this.wallImages[wallNum] = img;

            wallNum++;
        }

    }

    public renderWalls(context: CanvasRenderingContext2D) {
        for (const wall of abWalls) {
            const pos = new Pos(wall[0], wall[1]);
            const radius = wall[2];

            const topLeft = new Pos(pos.x - radius, pos.y - radius);
            const bottRight = new Pos(pos.x + radius, pos.y + radius);

            if (this.clip.isVisible(topLeft) || this.clip.isVisible(bottRight)) {

                const clipPos = this.clip.translate(pos);

                if (this.context.settings.useBitmaps) {
                    const scaledRadius = this.clip.scale(radius) * MOUNTAIN_BITMAP_SCALE;
                    const wallNum = wall[3];

                    const img = this.wallImages[wallNum];
                    context.drawImage(img, 0, 0, img.width, img.height,
                        clipPos.x - scaledRadius, clipPos.y - scaledRadius, scaledRadius * 2, scaledRadius * 2);

                } else {
                    const scaledradius = this.clip.scale(radius);
                    context.fillStyle = wallColor;
                    context.beginPath();

                    context.arc(clipPos.x, clipPos.y, scaledradius, 0, 2 * Math.PI);
                    context.fill();
                }
            }
        }
    }
}
