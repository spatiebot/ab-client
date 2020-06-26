import { FLAG_DEFAULT_POSITION } from "../../ab-assets/ctf-constants";
import { CTF_FLAG_STATE, CTF_TEAMS, GAME_TYPES } from "../../ab-protocol/src/lib";
import { IContext } from "../../app-context/icontext";
import { Upgrades } from "../../models/upgrades";

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

    private toString(n: number) {
        if (n !== 0 && !n) {
            return "";
        }

        return "" + n;
    }

    public render(): void {
        const me = this.context.state.getFocusedPlayer();
        if (!me) {
            return;
        }

        this.scoreElement.innerText = this.toString(me.score);
        this.killsElement.innerText = this.toString(me.kills);
        this.deathsElement.innerText = this.toString(me.deaths);

        const upgrades = me.upgrades || new Upgrades();

        this.upgradesElement.innerText = this.toString(upgrades.available);
        this.upgrDefenseElement.innerText = this.toString(upgrades.defense);
        this.upgrEnergyElement.innerText = this.toString(upgrades.energy);
        this.upgrMissileElement.innerText = this.toString(upgrades.missile);
        this.upgrSpeedElement.innerText = this.toString(upgrades.speed);

        // CTF stats
        if (this.context.gameType === GAME_TYPES.CTF && this.ctfInfo.style.display !== "block") {
            this.ctfInfo.style.display = "block";
        }

        const blueInfo = this.context.state.getCtfTeam(CTF_TEAMS.BLUE);
        const redInfo = this.context.state.getCtfTeam(CTF_TEAMS.RED);

        const blueScore = blueInfo.score ? blueInfo.score : 0;
        const redScore = redInfo.score ? redInfo.score : 0;

        this.blueScore.innerText = this.toString(blueScore);
        this.redScore.innerText = this.toString(redScore);

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
