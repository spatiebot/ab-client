import { MOB_TYPES } from "../../ab-protocol/src/lib";
import { IContext } from "../../app-context/icontext";
import { PeriodicLogger } from "../../helpers/periodic-logger";
import { ClippedView } from "../clipped-view";

const CRATE_HALF_SIZE = 12;
const CRATE_SIZE = CRATE_HALF_SIZE * 2;
const CRATE_ROTATION = Math.PI / 4;

declare const constants: any;

export class UpcratesRenderer {

    private logger: PeriodicLogger;

    constructor(private context: IContext, private clip: ClippedView) {
        this.logger = new PeriodicLogger(context);
    }

    public renderUpcrates(context: CanvasRenderingContext2D) {
        for (const crate of this.context.readState.getUpcrates()) {
            const pos = crate.pos;

            if (!pos || !this.clip.isVisible(pos)) {
                // this.logger.log("not visible", pos, this.clip.getClipRectangle());
                continue;
            }

            let fillColor = constants.UPCRATES_UPGRADE_CRATE_COLOR;
            switch (crate.mobType) {
                case MOB_TYPES.INFERNO:
                    fillColor = constants.UPCRATES_RAMPAGE_CRATE_COLOR;
                    break;
                case MOB_TYPES.SHIELD:
                    fillColor = constants.UPCRATES_SHIELD_CRATE_COLOR;
                    break;
            }

            const clipPos = this.clip.translate(pos);

            context.translate(clipPos.x, clipPos.y);
            context.rotate(CRATE_ROTATION);

            context.beginPath();
            context.fillStyle = fillColor;
            const halfSize = this.clip.scale(CRATE_HALF_SIZE);
            const size = this.clip.scale(CRATE_SIZE);
            context.rect(-halfSize, -halfSize, size, size);
            context.fill();
            context.fillStyle = constants.UPCRATES_BORDER_COLOR;
            context.stroke();

            context.rotate(-CRATE_ROTATION);
            context.translate(-clipPos.x, -clipPos.y);
        }
    }
}
