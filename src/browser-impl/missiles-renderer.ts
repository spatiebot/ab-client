import { PROJECTILES_SPECS } from "../ab-assets/missile-constants";
import { IContext } from "../app-context/icontext";
import { ClippedView } from "./clipped-view";

const MISSILE_IMAGE_BASE_SCALE = 0.3;

export class MissilesRenderer {

    private readonly missileImage: HTMLImageElement;

    constructor(private context: IContext, private clip: ClippedView) {
        this.missileImage = document.getElementById("missile") as HTMLImageElement;
    }

    public renderMissiles(context: CanvasRenderingContext2D) {
        context.fillStyle = "red";
        for (const missile of this.context.state.getMissiles()) {
            const pos = missile.pos;
            if (!pos) {
                continue;
            }

            if (!this.clip.isVisible(pos)) {
                continue;
            }

            const clipPos = this.clip.translate(pos);

            if (this.context.settings.useBitmaps) {
                context.translate(clipPos.x, clipPos.y);
                context.rotate(missile.rot);

                const imageScale = 1 + (PROJECTILES_SPECS[missile.mobType].damage as number - 0.3) / 1.8;
                const targetWidth = this.clip.scale(this.missileImage.width *
                    imageScale * MISSILE_IMAGE_BASE_SCALE);
                const targetHeight = this.clip.scale(this.missileImage.height *
                    imageScale * MISSILE_IMAGE_BASE_SCALE);

                context.drawImage(this.missileImage, 0, 0, this.missileImage.width, this.missileImage.height,
                    -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);

                context.rotate(-missile.rot);
                context.translate(-clipPos.x, -clipPos.y);
            } else {
                context.beginPath();
                context.arc(clipPos.x, clipPos.y, 4, 0, 2 * Math.PI);
                context.fill();
            }
        }
    }
}
