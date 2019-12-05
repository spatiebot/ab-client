import { CTF_TEAMS } from "../ab-protocol/src/lib";
import { CtfTeam } from "../models/ctf-team";
import { Mob } from "../models/mob";
import { Player } from "../models/player";

export class State {
    public id: number;
    public ping: number;
    public numPlayers: number;
    public numPlayersTotal: number;

    private players = {};
    private mobs = {};
    private teams = {};

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

    public getCtfTeam(team: CTF_TEAMS): CtfTeam {
        return this.teams[team];
    }

    public getOtherCtfTeam(team: CTF_TEAMS): CtfTeam {
        const otherTeam = team === CTF_TEAMS.BLUE ? CTF_TEAMS.RED : CTF_TEAMS.BLUE;
        return this.teams[otherTeam];
    }
}
