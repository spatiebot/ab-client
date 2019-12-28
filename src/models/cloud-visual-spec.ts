import { PROJECTILES_SPECS } from "../ab-assets/missile-constants";
import { MOB_TYPES } from "../ab-protocol/src/lib";

const specs = {};

export class CloudVisualSpec {

    public static getFor(type: MOB_TYPES): CloudVisualSpec {
        if (!specs[type]) {
            specs[type] = new CloudVisualSpec(type);
        }
        return specs[type];
    }

    public readonly opacityMax = 0.22;

    public readonly cloudTimeoutMs: number;
    public readonly cloudGrowMs: number;

    public readonly opacityGrowStep: number;
    public readonly opacityShrinkStep: number;

    public readonly sizeStart: number;
    public readonly sizeMax: number;
    public readonly sizeShrinkStep: number;
    public readonly sizeGrowStep: number;

    public readonly spawnFreq: number;
    public readonly distribBandwidth: number;

    constructor(type: MOB_TYPES) {
        const scale = 1 + (PROJECTILES_SPECS[type].damage as number - 0.3) / 1.8;

        this.cloudTimeoutMs = 800 * scale;
        this.cloudGrowMs = 200 * scale;

        this.opacityGrowStep = this.opacityMax / this.cloudGrowMs;
        this.opacityShrinkStep = this.opacityMax / (this.cloudTimeoutMs - this.cloudGrowMs);

        this.sizeStart = 5 * scale;
        this.sizeMax = 15 * scale;

        this.sizeShrinkStep = this.sizeMax / (this.cloudTimeoutMs - this.cloudGrowMs);
        this.sizeGrowStep = (this.sizeMax - this.sizeStart) / this.cloudGrowMs;

        this.spawnFreq = Math.ceil(2 * scale * 1.2);

        this.distribBandwidth = Math.ceil(3 * scale);
    }

}
