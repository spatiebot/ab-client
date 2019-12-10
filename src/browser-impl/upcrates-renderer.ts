import { MOB_TYPES } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { PeriodicLogger } from "../helpers/periodic-logger";
import { ClippedView } from "./clipped-view";

const rampageCrateColor = "rgba(150, 0, 0, 0.8)";
const shieldCrateColor = "white";
const upgradeCrateColor = "rgba(196, 188, 114, 0.8)";
const borderColor = "gray";
const CRATE_HALF_SIZE = 8;
const CRATE_SIZE = CRATE_HALF_SIZE * 2;
const CRATE_ROTATION = Math.PI / 4;

export class UpcratesRenderer {

    private logger: PeriodicLogger;

    constructor(private context: IContext, private clip: ClippedView) {
        this.logger = new PeriodicLogger(context);
    }

    public renderUpcrates(context: CanvasRenderingContext2D) {
        for (const crate of this.context.state.getUpcrates()) {
            const pos = crate.pos;

            if (!pos || !this.clip.isVisible(pos)) {
                // this.logger.log("not visible", pos, this.clip.getClipRectangle());
                continue;
            }

            let fillColor = upgradeCrateColor;
            switch (crate.mobType) {
                case MOB_TYPES.INFERNO:
                    fillColor = rampageCrateColor;
                    break;
                case MOB_TYPES.SHIELD:
                    fillColor = shieldCrateColor;
                    break;
            }

            const clipPos = this.clip.translate(pos);

            context.translate(clipPos.x, clipPos.y);
            context.rotate(CRATE_ROTATION);

            context.beginPath();
            context.fillStyle = fillColor;
            context.rect(-CRATE_HALF_SIZE, -CRATE_HALF_SIZE, CRATE_SIZE, CRATE_SIZE);
            context.fill();
            context.fillStyle = borderColor;
            context.stroke();

            context.rotate(-CRATE_ROTATION);
            context.translate(-clipPos.x, -clipPos.y);
        }
    }
}
