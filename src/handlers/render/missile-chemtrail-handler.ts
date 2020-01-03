import { PROJECTILES_SPECS } from "../../ab-assets/missile-constants";
import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { ITickArgs } from "../../events/event-args/itick-args";
import { EventMessage } from "../../events/event-message";
import { CloudVisual } from "../../models/cloud-visual";
import { CloudVisualSpec } from "../../models/cloud-visual-spec";
import { Pos } from "../../models/pos";
import { IMessageHandler } from "../imessage-handler";

export class MissileChemtrailHandler implements IMessageHandler {

    public handles = [Events.TICK];

    constructor(private context: BrowserContext) {
    }

    public exec(ev: EventMessage): void {

        if (!this.context.isBrowserVisible) {
            return;
        }

        const tick = ev.args as ITickArgs;

        for (const missile of this.context.state.getMissiles()) {

            const cloudVisualSpec = CloudVisualSpec.getFor(missile.mobType);

            if (tick.frame % cloudVisualSpec.spawnFreq === 0) {
                const cloud = new CloudVisual(cloudVisualSpec);
                cloud.pos = new Pos(missile.pos);

                const maxSpeed = PROJECTILES_SPECS[missile.mobType].maxSpeed;
                const jumpX = missile.speed.y / maxSpeed * cloudVisualSpec.distribBandwidth;
                const jumpY = missile.speed.x / maxSpeed * cloudVisualSpec.distribBandwidth;
                cloud.pos.x += tick.frame % (cloudVisualSpec.spawnFreq * 2) === 0 ? -jumpX : jumpX;
                cloud.pos.y += tick.frame % (cloudVisualSpec.spawnFreq * 2) === 0 ? jumpY : -jumpY;
                this.context.state.addRocketTrailCloud(cloud);
            }
        }
    }
}
