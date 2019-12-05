import { Player } from "../models/player";
import { Mob } from "../models/mob";
import { CtfTeam } from "../models/ctf-team";
import { CTF_TEAMS } from "../ab-protocol/src/lib";

export class State {
    id: number;
    ping: number;
    numPlayers: number;
    numPlayersTotal: number;

    private players = {};
    private mobs = {};
    private crates = {};
    private teams = {};

    constructor() {
        this.teams[CTF_TEAMS.BLUE] = new CtfTeam();
        this.teams[CTF_TEAMS.RED] = new CtfTeam();
    }

    addPlayer(p: Player): void {
        this.players[Number(p.id)] = p;
    }

    removePlayer(id: number) {
        delete this.players[Number(id)];
    }

    getMe(): Player {
        return this.getPlayerById(this.id);
    }

    getPlayerById(id: number): Player {
        return this.players[Number(id)];
    }

    getPlayerName(id: number): string {
        if (!id) {
            return "(empty)";
        }

        const p = this.getPlayerById(id);
        if (!p) {
            return id + "_(left)";
        }

        return p.name;
    }

    addMob(m: Mob): void {
        this.mobs[Number(m.id)] = m;
    }

    removeMob(id: number): void {
        delete this.mobs[Number(id)];
    }

    getMobById(id: number): Mob {
        return this.mobs[Number(id)];
    }

    getCtfTeam(team: CTF_TEAMS): CtfTeam {
        return this.teams[team];
    }

    getOtherCtfTeam(team: CTF_TEAMS): CtfTeam {
        const otherTeam = team == CTF_TEAMS.BLUE ? CTF_TEAMS.RED : CTF_TEAMS.BLUE;
        return this.teams[otherTeam];
    }
}