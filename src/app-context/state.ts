import { CTF_TEAMS, MOB_TYPES } from "../ab-protocol/src/lib";
import { CtfTeam } from "../models/ctf-team";
import { ExplosionVisual } from "../models/explosion-visual";
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

export class State {
    public id: number;
    public ping: number;
    public numPlayers: number;
    public numPlayersTotal: number;

    private players = {};
    private mobs = {};
    private teams = {};
    private explosions: ExplosionVisual[] = [];
    private kills: KillVisual[] = [];

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

    public getCtfTeam(team: CTF_TEAMS): CtfTeam {
        return this.teams[team];
    }

    public getOtherCtfTeam(team: CTF_TEAMS): CtfTeam {
        const otherTeam = team === CTF_TEAMS.BLUE ? CTF_TEAMS.RED : CTF_TEAMS.BLUE;
        return this.teams[otherTeam];
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

}
