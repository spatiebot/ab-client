import { KEY_CODES } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { Rotation } from "../helpers/rotation";
import { IPos } from "../models/ipos";
import { Player } from "../models/player";

const rotationSpeeds = {
    1: 0.39, // predator
    2: 0.24, // goliath
    3: 0.42, // mohawk
    4: 0.33, // tornado
    5: 0.33  // prowler
};

const ROT_PRECISION = 0.1;

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

        if (absDiff < ROT_PRECISION || !absDiff) {
            this.context.connection.sendKey(KEY_CODES.LEFT, false);
            this.context.connection.sendKey(KEY_CODES.RIGHT, false);
            clearTimeout(this.context.botstate.turningTimeout);
            this.context.botstate.turningTimeout = null;
        }
        else {
            let key: KEY_CODES;
            let otherKey: KEY_CODES;
            if (rotDiff > 0) {
                key = KEY_CODES.RIGHT;
                otherKey = KEY_CODES.LEFT;
            } else {
                key = KEY_CODES.LEFT;
                otherKey = KEY_CODES.RIGHT;
            }
            this.context.connection.sendKey(key, true);
            this.context.connection.sendKey(otherKey, false);

            const timeToWait = absDiff / rotationSpeeds[this.me.type];
            this.context.botstate.turningTimeout = setTimeout(() => {
                this.context.connection.sendKey(key, false);
                this.context.botstate.turningTimeout = null;
            }, timeToWait * 100);
        }
    }
}