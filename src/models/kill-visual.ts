import { StopWatch } from "../helpers/stopwatch";
import { Pos } from "./pos";

const KILL_TIMEOUT_MS = 500;
const KILL_MAX_SIZE = 60;
const KILL_GROW_PER_MS = KILL_MAX_SIZE / KILL_TIMEOUT_MS;

export class KillVisual {
    public pos: Pos;

    private stopwatch = new StopWatch();

    public get isFinished(): boolean {
        return this.stopwatch.elapsedMs > KILL_TIMEOUT_MS;
    }

    public get size(): number {
        return this.stopwatch.elapsedMs * KILL_GROW_PER_MS;
    }
}
