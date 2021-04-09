import { SHIPS_SPECS } from "../ab-assets/ships-constants";
import { KEY_CODES } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { Rotation } from "../helpers/rotation";
import { IPos } from "../models/ipos";
import { Player } from "../models/player";

const MS_PER_SEC = 1000;
const FPS = 60;
const MS_PER_FRAME = MS_PER_SEC / FPS;

export class FaceLocationExecutor {

    constructor(private context: IContext, private me: Player, private locationToFace: IPos) {

    }

    public execute() {

        if (this.context.botstate.turningTimeout) {
            return;
        }

        const pos = this.locationToFace;

        const targetRotation = Rotation.getTargetRotation(this.me.pos, pos);
        const rotDiff = Rotation.getAngleDiff(this.me.rot, targetRotation);
        const absDiff = Math.abs(rotDiff);

        let key: KEY_CODES;
        let otherKey: KEY_CODES;
        if (rotDiff > 0) {
            key = KEY_CODES.RIGHT;
            otherKey = KEY_CODES.LEFT;
        } else {
            key = KEY_CODES.LEFT;
            otherKey = KEY_CODES.RIGHT;
        }

        // turnfactor = turning distance per frame
        const turnFactor = SHIPS_SPECS[this.me.type].turnFactor;
        const framesNeededToTurn = absDiff / turnFactor
        const duration = framesNeededToTurn * MS_PER_FRAME;
        this.context.botstate.enqueueKey(key, true, duration);
        this.context.botstate.enqueueKey(otherKey, false);
    }
}