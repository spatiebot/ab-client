import { CTF_TEAMS, MOB_TYPES } from "../ab-protocol/src/lib";
import { CloudVisual } from "../models/cloud-visual";
import { CtfTeam } from "../models/ctf-team";
import { ExplosionVisual } from "../models/explosion-visual";
import { GoliFartVisual } from "../models/golifart-visual";
import { KillVisual } from "../models/kill-visual";
import { Mob } from "../models/mob";
import { Player } from "../models/player";
import { WriteableState } from "./writable-state";

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
    public spectatingId: number;
    public myPlayerId: number;
    public isAutoFiring: boolean;

    // random debug info
    public skippedFrames: number = 0;

    protected players = {};
    protected mobs = {};
    protected teams = {};
    protected explosions: ExplosionVisual[] = [];
    protected farts: GoliFartVisual[] = [];
    protected kills: KillVisual[] = [];
    protected rocketTrailClouds: CloudVisual[] = [];

    constructor() {
        this.teams[CTF_TEAMS.BLUE] = new CtfTeam();
        this.teams[CTF_TEAMS.RED] = new CtfTeam();
    }

    public syncState(s: WriteableState) {
        this.id = s.id;
        this.team = s.team;
        this.ping = s.ping;
        this.numPlayers = s.numPlayers;
        this.numPlayersTotal = s.numPlayersTotal;
        this.spectatingId = s.spectatingId;
        this.myPlayerId = s.myPlayerId;
        this.isAutoFiring = s.isAutoFiring;

        this.skippedFrames = s.skippedFrames;

        const actors = s.getActors();
        this.players = actors.players;
        this.mobs = actors.mobs;
        this.teams = actors.teams;

        this.explosions = s.getActiveExplosions();
        this.farts = s.getActiveFarts();
        this.kills = s.getActiveKills();
        this.rocketTrailClouds = s.getActiveRocketTrailClouds();
    }

    // get the player that has the focus. Mostly the player himself.
    // In case of spectating, this returns the player being spectated.
    public getFocusedPlayer(): Player {
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

    public getActiveExplosions(): ExplosionVisual[] {
        const activeExplosions = this.explosions.filter((e) => !e.isFinished);
        return activeExplosions;
    }

    public getActiveKills(): KillVisual[] {
        const activeKills = this.kills.filter((e) => !e.isFinished);
        return activeKills;
    }

    public getActiveFarts(): GoliFartVisual[] {
        const activeFarts = this.farts.filter((e) => !e.isFinished);
        return activeFarts;
    }

    public getActiveRocketTrailClouds(): CloudVisual[] {
        const activeClouds = this.rocketTrailClouds.filter((e) => !e.isFinished);
        return activeClouds;
    }

}
