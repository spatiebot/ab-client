import { StopWatch } from "../helpers/stopwatch";
import { CloudVisualSpec } from "./cloud-visual-spec";
import { Pos } from "./pos";

export class CloudVisual {
    public pos: Pos;

    public readonly stopwatch: StopWatch = new StopWatch();

    constructor(private spec: CloudVisualSpec) {
    }

    public get isFinished(): boolean {
        return this.stopwatch.elapsedMs > this.spec.cloudTimeoutMs;
    }

    public get opacity(): number {
        if (this.stopwatch.elapsedMs < this.spec.cloudGrowMs) {
            // growing
            return this.stopwatch.elapsedMs * this.spec.opacityGrowStep;
        }
        // shrinking
        return Math.max(0, this.spec.opacityMax - this.stopwatch.elapsedMs * this.spec.opacityShrinkStep);
    }

    public get size(): number {
        if (this.stopwatch.elapsedMs < this.spec.cloudGrowMs) {
            // growing
            return this.spec.sizeStart + this.stopwatch.elapsedMs * this.spec.sizeGrowStep;
        }
        // shrinking
        return Math.max(0, this.spec.sizeMax - this.spec.sizeShrinkStep * this.stopwatch.elapsedMs);
    }

    public static create(o: CloudVisual): CloudVisual {
        const kv = new CloudVisual(o.spec);
        kv.pos = new Pos(o.pos);
        kv.stopwatch.startTime = o.stopwatch.startTime;
        return kv;
    }

}
