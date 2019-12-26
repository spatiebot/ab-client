import { CTF_FLAG_STATE, CTF_TEAMS, GAME_TYPES } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { Pos } from "../models/pos";
import { Upgrades } from "../models/upgrades";

const FLAG_DEFAULT_POSITION = {
    blue: new Pos({ x: -9670, y: -1470 }),
    red: new Pos({ x: 8600, y: -940 }),
};

export class StatsRenderer {

    private scoreElement: HTMLSpanElement;
    private upgradesElement: HTMLSpanElement;
    private killsElement: HTMLSpanElement;
    private deathsElement: HTMLSpanElement;
    private upgrSpeedElement: HTMLSpanElement;
    private upgrDefenseElement: HTMLSpanElement;
    private upgrEnergyElement: HTMLSpanElement;
    private upgrMissileElement: HTMLSpanElement;

    private ctfInfo: HTMLElement;
    private blueScore: HTMLSpanElement;
    private blueFlagLocation: HTMLSpanElement;
    private redScore: HTMLSpanElement;
    private redFlagLocation: HTMLSpanElement;

    constructor(private context: IContext) {
        this.scoreElement = document.getElementById("stats-score") as HTMLSpanElement;
        this.upgradesElement = document.getElementById("stats-upgrades") as HTMLSpanElement;
        this.killsElement = document.getElementById("stats-kills") as HTMLSpanElement;
        this.deathsElement = document.getElementById("stats-deaths") as HTMLSpanElement;
        this.upgrSpeedElement = document.getElementById("stats-speed") as HTMLSpanElement;
        this.upgrDefenseElement = document.getElementById("stats-defense") as HTMLSpanElement;
        this.upgrEnergyElement = document.getElementById("stats-energy") as HTMLSpanElement;
        this.upgrMissileElement = document.getElementById("stats-missile") as HTMLSpanElement;

        this.ctfInfo = document.getElementById("ctf-info");
        this.blueScore = document.getElementById("blue-score") as HTMLSpanElement;
        this.redScore = document.getElementById("red-score") as HTMLSpanElement;
        this.blueFlagLocation = document.getElementById("blue-flag-location") as HTMLSpanElement;
        this.redFlagLocation = document.getElementById("red-flag-location") as HTMLSpanElement;
    }

    public render(): void {
        const me = this.context.state.getMe();
        if (!me) {
            return;
        }

        this.scoreElement.innerText = "" + me.score;
        this.killsElement.innerText = "" + me.kills;
        this.deathsElement.innerText = "" + me.deaths;

        const upgrades = me.upgrades || new Upgrades();

        this.upgradesElement.innerText = "" + upgrades.available;
        this.upgrDefenseElement.innerText = "" + upgrades.defense;
        this.upgrEnergyElement.innerText = "" + upgrades.energy;
        this.upgrMissileElement.innerText = "" + upgrades.missile;
        this.upgrSpeedElement.innerText = "" + upgrades.speed;

        // CTF stats
        if (this.context.gameType === GAME_TYPES.CTF && this.ctfInfo.style.display !== "block") {
            this.ctfInfo.style.display = "block";
        }

        const blueInfo = this.context.state.getCtfTeam(CTF_TEAMS.BLUE);
        const redInfo = this.context.state.getCtfTeam(CTF_TEAMS.RED);

        const blueScore = blueInfo.score ? blueInfo.score : 0;
        const redScore = redInfo.score ? redInfo.score : 0;

        this.blueScore.innerText = "" + blueScore;
        this.redScore.innerText = "" + redScore;

        let blueFlagLocation = "?";
        if (blueInfo.flagState === CTF_FLAG_STATE.DYNAMIC) {
            const carrierName = this.context.state.getPlayerName(blueInfo.flagTakenById);
            blueFlagLocation = `taken by ${carrierName}`;
        } else if (FLAG_DEFAULT_POSITION.blue.equals(blueInfo.flagPos)) {
            blueFlagLocation = "home";
        } else {
            blueFlagLocation = "abandoned";
        }
        this.blueFlagLocation.innerText = blueFlagLocation;

        let redFlagLocation = "?";
        if (redInfo.flagState === CTF_FLAG_STATE.DYNAMIC) {
            const carrierName = this.context.state.getPlayerName(redInfo.flagTakenById);
            redFlagLocation = `taken by ${carrierName}`;
        } else if (FLAG_DEFAULT_POSITION.red.equals(redInfo.flagPos)) {
            redFlagLocation = "home";
        } else {
            redFlagLocation = "abandoned";
        }
        this.redFlagLocation.innerText = redFlagLocation;
    }
}
