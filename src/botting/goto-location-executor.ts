import { KEY_CODES } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { Delta } from "../helpers/delta";
import { IPos } from "../models/ipos";
import { Player } from "../models/player";
import { FaceLocationExecutor } from "./face-location-executor";
import { PathFinding } from "./path-finding";

const DISTANCE_CLOSE = 300;
const DISTANCE_TOO_CLOSE = 50;
const SKIP_STEPS_IN_HIGHRES = 8;
const SKIP_STEPS_IN_LOWRES = 2;

interface IGotoResult {
    isClose: boolean;
    distance: number;
}

export class GotoLocationExecutor {

    public static DISTANCE_CLOSE = DISTANCE_CLOSE;

    constructor(private context: IContext, private me: Player, private posToGoTo: IPos) {

    }

    private finish(isClose: boolean, distance: number): IGotoResult {
        this.context.botstate.path = null;
        this.context.connection.sendKey(KEY_CODES.UP, false);
        return { isClose, distance };
    }

    public execute(): IGotoResult {
        const { distance } = Delta.getDelta(this.me.pos, this.posToGoTo);

        if (distance < DISTANCE_TOO_CLOSE) {
            return this.finish(true, distance);
        }

        let path: IPos[];
        let isHighres: boolean;
        try {
            const calculatedPath = PathFinding.findPath(this.me.pos, this.posToGoTo, this.me.type);
            path = calculatedPath.path;
            isHighres = calculatedPath.isHighres;
        } catch (error) {
            return this.finish(false, distance);
        }

        this.context.botstate.path = path;

        let nextStep = path[isHighres ? SKIP_STEPS_IN_HIGHRES : SKIP_STEPS_IN_LOWRES];
        if (!nextStep) {
            nextStep = path[1];
        }
        if (!nextStep) {
            return this.finish(true, distance);
        }

        const faceLocation = new FaceLocationExecutor(this.context, this.me, nextStep);
        faceLocation.execute();

        const isClose = isHighres && distance < DISTANCE_CLOSE; // && path.length < PATH_LENGTH_CLOSE;
        if (isClose) {
            return this.finish(true, distance);
        } else {
            this.context.connection.sendKey(KEY_CODES.UP, true);
        }
        return { isClose, distance };
    }
}