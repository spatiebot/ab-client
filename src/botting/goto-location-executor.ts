import { SHIPS_TYPES } from "../ab-assets/ships-constants";
import { KEY_CODES } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { Delta } from "../helpers/delta";
import { Prediction } from "../helpers/prediction";
import { IPos } from "../models/ipos";
import { Player } from "../models/player";
import { FaceLocationExecutor } from "./face-location-executor";

const DISTANCE_CLOSE = 300;
const DISTANCE_TOO_CLOSE = 50;
const DISTANCE_FAR = DISTANCE_CLOSE * 2;

const MS_PER_SEC = 1000;
const FPS = 60;
const MS_PER_FRAME = MS_PER_SEC / FPS;

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
        this.context.botstate.enqueueKey(KEY_CODES.UP, false);
        this.context.botstate.enqueueKey(KEY_CODES.DOWN, true);
        return { isClose, distance };
    }

    public execute(tickDuration: number, allowBoostRange: number = DISTANCE_FAR): IGotoResult {
        const { distance } = Delta.getDelta(this.me.pos, this.posToGoTo);

        if (distance < DISTANCE_TOO_CLOSE) {
            return this.finish(true, distance);
        }

        this.context.botstate.initPathFindingWorker();

        if (!this.context.botstate.isCalculatingPath) {
            // avoid players and missiles
            const avoid: IPos[] = [];
            for (const p of this.context.state.getPlayers()) {
                if (p.id === this.me.id || p.id === this.context.botstate.playerToKill) {
                    continue;
                }
                avoid.push(Prediction.predictPosition(p.mostReliablePos, p.speed, tickDuration));
            }
            for (const m of this.context.state.getMissiles()) {
                if (m.team === this.me.team) {
                    continue;
                }
                avoid.push(Prediction.predictPosition(m.pos, m.speed, tickDuration));
            }

            this.context.botstate.calcPath({
                pos1: this.me.pos,
                pos2: this.posToGoTo,
                aircraftType: this.me.type,
                pointsToAvoid: avoid
            });
        }

        if (!this.context.botstate.path) {
            // still calculating
            return { isClose: false, distance };
        }

        const path = this.context.botstate.path;
        const nextStep = this.nextStep(path, tickDuration);
        if (!nextStep) {
            return this.finish(true, distance);
        }

        const faceLocation = new FaceLocationExecutor(this.context, this.me, nextStep);
        faceLocation.execute();

        const isClose = distance < DISTANCE_CLOSE; // && path.length < PATH_LENGTH_CLOSE;
        if (isClose) {
            return this.finish(true, distance);
        } else {
            this.context.botstate.enqueueKey(KEY_CODES.UP, true);

            if (this.me.type === SHIPS_TYPES.PREDATOR) {
                this.context.botstate.autoBoost = distance > allowBoostRange;
            }
        }
        return { isClose, distance };
    }

    nextStep(path: IPos[], tickDurationMs: number) {
        const firstStep = path[0];
        if (!firstStep) {
            return null;
        }
        const { distance } = Delta.getDelta(this.me.mostReliablePos, firstStep);

        const numFramesInPrevTick = tickDurationMs / MS_PER_FRAME;
        const distancePrevTick = Math.sqrt(Math.pow(this.me.speed.y, 2) + Math.pow(this.me.speed.x, 2)) * numFramesInPrevTick;
        if (distance > distancePrevTick * 3) {
            this.context.botstate.path = path.slice(1);

            return firstStep;
        }

        return this.nextStep(path.slice(1), tickDurationMs);
    }
}