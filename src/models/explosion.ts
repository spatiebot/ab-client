import { MOB_TYPES } from "../ab-protocol/src/lib";
import { StopWatch } from "../helpers/stopwatch";
import { Pos } from "./pos";

const EXPLOSION_TIMEOUT_MS = 500;
const EXPLOSION_MAX_SIZE = 30;

export class Explosion {
    public pos: Pos;
    public type: MOB_TYPES;

    private stopwatch: StopWatch = new StopWatch();

    public get isFinished(): boolean {
        return this.stopwatch.elapsedMs > EXPLOSION_TIMEOUT_MS;
    }

    public get size(): number {
        return this.stopwatch.elapsedMs * EXPLOSION_MAX_SIZE / EXPLOSION_TIMEOUT_MS;
    }
}
