import { IContext } from "../app-context/icontext";
import { PeriodicLogger } from "../helpers/periodic-logger";
import { ClippedView } from "./clipped-view";
import { MissilesRenderer } from "./missiles-renderer";
import { PlayersRenderer } from "./players-renderer";
import { WallsRenderer } from "./walls-renderer";

export class Renderer {
    private canvases: HTMLCanvasElement[] = [];
    private contexts: CanvasRenderingContext2D[] = [];
    private activeCanvasIndex = 0;
    private otherCanvasIndex = 1;

    private chatBox: HTMLDivElement;

    // private readonly fullWidth = 33000;
    // private readonly fullHeight = 16600;

    private clip: ClippedView;
    private playersRenderer: PlayersRenderer;
    private wallsRenderer: WallsRenderer;
    private missilesRenderer: MissilesRenderer;

    private periodicLogger: PeriodicLogger;

    constructor(private context: IContext) {
        this.initializeCanvas("#first", 0);
        this.initializeCanvas("#second", 1);

        this.chatBox = document.getElementById("chat") as HTMLDivElement;

        this.periodicLogger = new PeriodicLogger(context);
        this.clip = new ClippedView(context);
        this.playersRenderer = new PlayersRenderer(context, this.clip);
        this.wallsRenderer = new WallsRenderer(this.clip);
        this.missilesRenderer = new MissilesRenderer(context, this.clip);
    }

    public addChat(playerName: string, msg: string) {
        playerName = playerName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        this.chatBox.innerHTML += `<div>${playerName}: ${msg}</div>`;
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }

    public renderMobs(): void {
        if (!this.context.state.getMe()) {
            return;
        }

        // draw on the invisible canvas
        const canvas = this.canvases[this.otherCanvasIndex];
        const context = this.contexts[this.otherCanvasIndex];

        this.clip.setClip(canvas);

        // make empty
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw walls
        this.wallsRenderer.renderWalls(context);
        // draw players
        this.playersRenderer.renderPlayers(context);
        // draw missiles
        this.missilesRenderer.renderMissiles(context);

        // switch the canvases
        canvas.style.display = "inherit";
        this.canvases[this.activeCanvasIndex].style.display = "hidden";
        this.activeCanvasIndex = this.otherCanvasIndex;
        this.otherCanvasIndex = this.activeCanvasIndex;
    }

    private initializeCanvas(name: string, index: number): void {
        const canvas = document.querySelector(name) as HTMLCanvasElement;
        const context = canvas.getContext("2d");
        this.canvases[index] = canvas;
        this.contexts[index] = context;
    }

}
