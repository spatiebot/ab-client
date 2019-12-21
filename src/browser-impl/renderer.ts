import { IContext } from "../app-context/icontext";
import { PeriodicLogger } from "../helpers/periodic-logger";
import { Upgrades } from "../models/upgrades";
import { BackgroundRenderer } from "./background-renderer";
import { ClippedView } from "./clipped-view";
import { ExplosionsRenderer } from "./explosions-renderer";
import { MissilesRenderer } from "./missiles-renderer";
import { PlayersRenderer } from "./players-renderer";
import { UpcratesRenderer } from "./upcrates-renderer";
import { WallsRenderer } from "./walls-renderer";

export class Renderer {

    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;

    private chatBox: HTMLDivElement;

    private scoreElement: HTMLSpanElement;
    private upgradesElement: HTMLSpanElement;
    private killsElement: HTMLSpanElement;
    private deathsElement: HTMLSpanElement;
    private upgrSpeedElement: HTMLSpanElement;
    private upgrDefenseElement: HTMLSpanElement;
    private upgrEnergyElement: HTMLSpanElement;
    private upgrMissileElement: HTMLSpanElement;

    private clip: ClippedView;
    private playersRenderer: PlayersRenderer;
    private wallsRenderer: WallsRenderer;
    private missilesRenderer: MissilesRenderer;
    private explosionsRenderer: ExplosionsRenderer;
    private upcratesRenderer: UpcratesRenderer;
    private backgroundRenderer: BackgroundRenderer;

    private periodicLogger: PeriodicLogger;

    constructor(private context: IContext) {

        this.getUiElements();

        this.periodicLogger = new PeriodicLogger(context);
        this.clip = new ClippedView(context);

        this.backgroundRenderer = new BackgroundRenderer(this.clip, context);
        this.playersRenderer = new PlayersRenderer(context, this.clip);
        this.wallsRenderer = new WallsRenderer(this.clip);
        this.missilesRenderer = new MissilesRenderer(context, this.clip);
        this.explosionsRenderer = new ExplosionsRenderer(context, this.clip);
        this.upcratesRenderer = new UpcratesRenderer(context, this.clip);
    }

    public addChat(playerName: string, msg: string) {
        playerName = playerName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        this.chatBox.innerHTML += `<div>${playerName}: ${msg}</div>`;
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }

    public showStats(score: number, kills: number, deaths: number, upgrades: Upgrades) {
        this.scoreElement.innerText = "" + score;
        this.killsElement.innerText = "" + kills;
        this.deathsElement.innerText = "" + deaths;

        upgrades = upgrades || new Upgrades();

        this.upgradesElement.innerText = "" + upgrades.available;
        this.upgrDefenseElement.innerText = "" + upgrades.defense;
        this.upgrEnergyElement.innerText = "" + upgrades.energy;
        this.upgrMissileElement.innerText = "" + upgrades.missile;
        this.upgrSpeedElement.innerText = "" + upgrades.speed;
    }

    public renderGame(): void {
        if (!this.context.state.getMe()) {
            return;
        }

        const context = this.canvasContext;
        this.clip.setClip(this.canvas);

        // background
        this.backgroundRenderer.renderBackground(context);
        // draw walls
        this.wallsRenderer.renderWalls(context);
        // upgrade and powerup crates
        this.upcratesRenderer.renderUpcrates(context);
        // draw players
        this.playersRenderer.renderPlayers(context);
        // draw missiles
        this.missilesRenderer.renderMissiles(context);
        // explosions and kills
        this.explosionsRenderer.renderExplosions(context);
    }

    private getUiElements() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext("2d");

        this.chatBox = document.getElementById("chat") as HTMLDivElement;
        this.scoreElement = document.getElementById("stats-score") as HTMLSpanElement;
        this.upgradesElement = document.getElementById("stats-upgrades") as HTMLSpanElement;
        this.killsElement = document.getElementById("stats-kills") as HTMLSpanElement;
        this.deathsElement = document.getElementById("stats-deaths") as HTMLSpanElement;
        this.upgrSpeedElement = document.getElementById("stats-speed") as HTMLSpanElement;
        this.upgrDefenseElement = document.getElementById("stats-defense") as HTMLSpanElement;
        this.upgrEnergyElement = document.getElementById("stats-energy") as HTMLSpanElement;
        this.upgrMissileElement = document.getElementById("stats-missile") as HTMLSpanElement;
    }
}
