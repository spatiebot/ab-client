import { CTF_TEAMS, MOB_TYPES } from "../ab-protocol/src/lib";
import { CloudVisual } from "../models/cloud-visual";
import { CtfTeam } from "../models/ctf-team";
import { ExplosionVisual } from "../models/explosion-visual";
import { GoliFartVisual } from "../models/golifart-visual";
import { KillVisual } from "../models/kill-visual";
import { Mob } from "../models/mob";
import { Player } from "../models/player";

const MISSILES: MOB_TYPES[] = [
    MOB_TYPES.PREDATOR_MISSILE,
    MOB_TYPES.GOLIATH_MISSILE,
    MOB_TYPES.COPTER_MISSILE,
    MOB_TYPES.TORNADO_MISSILE,
    MOB_TYPES.TORNADO_SMALL_MISSILE,
    MOB_TYPES.PROWLER_MISSILE,
];

const CRATES: MOB_TYPES[] = [
    MOB_TYPES.UPGRADE,
    MOB_TYPES.SHIELD,
    MOB_TYPES.INFERNO,
];

export class State {
    public id: number;
    public team: number;
    public ping: number;
    public numPlayers: number;
    public numPlayersTotal: number;

    private players = {};
    private mobs = {};
    private teams = {};
    private explosions: ExplosionVisual[] = [];
    private farts: GoliFartVisual[] = [];
    private kills: KillVisual[] = [];
    private rocketTrailClouds: CloudVisual[] = [];

    constructor() {
        this.teams[CTF_TEAMS.BLUE] = new CtfTeam();
        this.teams[CTF_TEAMS.RED] = new CtfTeam();
    }

    public addPlayer(p: Player): void {
        this.players[Number(p.id)] = p;
    }

    public removePlayer(id: number) {
        delete this.players[Number(id)];
    }

    public getMe(): Player {
        return this.getPlayerById(this.id);
    }

    public getPlayerById(id: number): Player {
        return this.players[Number(id)];
    }

    public getPlayerByName(name: string): Player {
        return this.getPlayers().find((x) => x.name === name);
    }

    public getPlayers(): Player[] {
        return Object.values(this.players);
    }

    public getPlayerName(id: number): string {
        if (!id) {
            return "(empty)";
        }

        const p = this.getPlayerById(id);
        if (!p) {
            return id + "_(left)";
        }

        return p.name;
    }

    public addMob(m: Mob): void {
        this.mobs[Number(m.id)] = m;
    }

    public removeMob(id: number): void {
        delete this.mobs[Number(id)];
    }

    public getMobById(id: number): Mob {
        return this.mobs[Number(id)];
    }

    public getMissiles(): Mob[] {
        const allMobs = Object.values(this.mobs) as Mob[];
        return allMobs.filter((m) => MISSILES.indexOf(m.mobType) !== -1);
    }

    public getUpcrates(): Mob[] {
        const allMobs = Object.values(this.mobs) as Mob[];
        return allMobs.filter((m) => CRATES.indexOf(m.mobType) !== -1);
    }

    public getCtfTeam(team: CTF_TEAMS): CtfTeam {
        return this.teams[team];
    }

    public getOtherCtfTeam(team: CTF_TEAMS): CtfTeam {
        const otherTeam = team === CTF_TEAMS.BLUE ? CTF_TEAMS.RED : CTF_TEAMS.BLUE;
        return this.teams[otherTeam];
    }

    public purgeAfterPanic(): void {
        // purge any fancy stuff, so the panic doesn't get worse: this prevents
        // rendering explosions from long ago.
        this.explosions.splice(0);
        this.kills.splice(0);
        this.rocketTrailClouds.splice(0);
    }

    public addExplosion(expl: ExplosionVisual) {
        this.explosions.push(expl);
    }

    // get only active explosions, also purges the collection of inactive explosions
    public getActiveExplosions(): ExplosionVisual[] {
        const activeExplosions = this.explosions.filter((e) => !e.isFinished);
        this.explosions = activeExplosions;
        return activeExplosions;
    }

    public addKill(kill: KillVisual) {
        this.kills.push(kill);
    }

    // get only active kill visuals, also purges the collection of inactive kills
    public getActiveKills(): KillVisual[] {
        const activeKills = this.kills.filter((e) => !e.isFinished);
        this.kills = activeKills;
        return activeKills;
    }

    public addFart(fart: GoliFartVisual) {
        this.farts.push(fart);
    }

    // get only active fart visuals, also purges the collection of inactive farts
    public getActiveFarts(): GoliFartVisual[] {
        const activeFarts = this.farts.filter((e) => !e.isFinished);
        this.farts = activeFarts;
        return activeFarts;
    }

    public addRocketTrailCloud(cloud: CloudVisual) {
        this.rocketTrailClouds.push(cloud);
    }

    public getActiveRocketTrailClouds(): CloudVisual[] {
        const activeClouds = this.rocketTrailClouds.filter((e) => !e.isFinished);
        this.rocketTrailClouds = activeClouds;
        return activeClouds;
    }

}
