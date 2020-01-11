import { PROJECTILES_SPECS } from "../../ab-assets/missile-constants";
import { GAME_TYPES } from "../../ab-protocol/src/lib";
import { IContext } from "../../app-context/icontext";
import { ClippedView } from "../clipped-view";

const MISSILE_IMAGE_BASE_SCALE = 1;

declare const constants: any;

export class MissilesRenderer {

    private readonly missileImage: HTMLImageElement;

    constructor(private context: IContext, private clip: ClippedView) {
        this.missileImage = document.getElementById("missile") as HTMLImageElement;
    }

    public renderMissiles(context: CanvasRenderingContext2D) {
        context.fillStyle = constants.MISSILE_COLOR;
        for (const missile of this.context.state.getMissiles()) {
            const pos = missile.pos;
            if (!pos) {
                continue;
            }

            if (!this.clip.isVisible(pos)) {
                continue;
            }

            const clipPos = this.clip.translate(pos);
            const missileScale = 1 + (PROJECTILES_SPECS[missile.mobType].damage as number - 0.3) / 1.8;

            if (this.context.settings.useBitmaps) {
                context.translate(clipPos.x, clipPos.y);
                context.rotate(missile.rot);

                let shouldRestoreAlphs = false;
                if (this.context.gameType === GAME_TYPES.CTF && missile.team) {
                    if (missile.team === this.context.state.team && missile.ownerId !== this.context.state.id) {
                        // show friendly missiles as transparent
                        context.globalAlpha = 0.4;
                        shouldRestoreAlphs = true;
                    }
                }

                const targetWidth = this.clip.scale(this.missileImage.width *
                    missileScale * MISSILE_IMAGE_BASE_SCALE);
                const targetHeight = this.clip.scale(this.missileImage.height *
                    missileScale * MISSILE_IMAGE_BASE_SCALE);

                context.drawImage(this.missileImage, 0, 0, this.missileImage.width, this.missileImage.height,
                    -targetWidth / 2, -targetHeight / 2, targetWidth, targetHeight);

                if (shouldRestoreAlphs) {
                    context.globalAlpha = 1;
                }

                context.rotate(-missile.rot);
                context.translate(-clipPos.x, -clipPos.y);
            } else {
                context.beginPath();
                context.arc(clipPos.x, clipPos.y, this.clip.scale(4 *  missileScale), 0, 2 * Math.PI);
                context.fill();
            }
        }
    }
}
