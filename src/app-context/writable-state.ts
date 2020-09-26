import { CloudVisual } from "../models/cloud-visual";
import { ExplosionVisual } from "../models/explosion-visual";
import { GoliFartVisual } from "../models/golifart-visual";
import { KillVisual } from "../models/kill-visual";
import { Mob } from "../models/mob";
import { Player } from "../models/player";
import { State } from "./state";

export class WriteableState extends State {

    public addPlayer(p: Player): void {
        this.players[Number(p.id)] = p;
    }

    public removePlayer(id: number) {
        delete this.players[Number(id)];
    }

    public addMob(m: Mob): void {
        this.mobs[Number(m.id)] = m;
    }

    public removeMob(id: number): void {
        delete this.mobs[Number(id)];
    }

    public purgeAfterPanic(): void {
        // purge any fancy stuff, so the panic doesn't get worse: this prevents
        // rendering explosions from long ago.
        this.explosions.splice(0);
        this.kills.splice(0);
        this.rocketTrailClouds.splice(0);
    }

    public addExplosion(expl: ExplosionVisual) {
        // purge this list and add the new explosion
        this.explosions = this.getActiveExplosions();
        this.explosions.push(expl);
    }


    public addKill(kill: KillVisual) {
        // purge the list and add the new kill
        this.kills = this.getActiveKills();
        this.kills.push(kill);
    }


    public addFart(fart: GoliFartVisual) {
        // purge the list and add new fart
        this.farts = this.getActiveFarts();
        this.farts.push(fart);
    }

    public addRocketTrailCloud(cloud: CloudVisual) {
        // purge the list and add new chemtrail
        this.rocketTrailClouds = this.getActiveRocketTrailClouds();
        this.rocketTrailClouds.push(cloud);
    }

    // expose actors for sync
    public getActors() {
        return {
            players: this.players,
            mobs: this.mobs,
            teams: this.teams
        }
    }
}