import { IContext } from "../app-context/icontext";
import { PeriodicLogger } from "../helpers/periodic-logger";
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

    private clip: ClippedView;
    private playersRenderer: PlayersRenderer;
    private wallsRenderer: WallsRenderer;
    private missilesRenderer: MissilesRenderer;
    private explosionsRenderer: ExplosionsRenderer;
    private upcratesRenderer: UpcratesRenderer;
    private backgroundRenderer: BackgroundRenderer;

    private periodicLogger: PeriodicLogger;

    constructor(private context: IContext) {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext("2d");

        this.chatBox = document.getElementById("chat") as HTMLDivElement;

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

}
