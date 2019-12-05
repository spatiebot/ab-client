import { abWalls } from "../ab-assets/walls";
import { PLAYER_STATUS } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { PeriodicLogger } from "../helpers/periodic-logger";
import { Pos } from "../models/pos";

export class Renderer {
    private canvases: HTMLCanvasElement[] = [];
    private contexts: CanvasRenderingContext2D[] = [];
    private activeCanvasIndex = 0;
    private otherCanvasIndex = 1;

    private chatBox: HTMLDivElement;

    private readonly fullWidth = 33000;
    private readonly fullHeight = 16600;
    private readonly scale = 1;

    private clip: Pos[];

    private periodicLogger: PeriodicLogger;

    constructor(private context: IContext) {
        this.initializeCanvas("#first", 0);
        this.initializeCanvas("#second", 1);

        this.chatBox = document.getElementById("chat") as HTMLDivElement;

        this.periodicLogger = new PeriodicLogger(context);
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

        this.setClip(canvas);

        // make empty
        context.clearRect(0, 0, canvas.width, canvas.height);

        // draw walls
        context.fillStyle = "gray";
        for (const point of abWalls) {
            const pos = new Pos(point[0], point[1]);
            const widthMargin = point[2] * this.scale;
            const halfWall = widthMargin / 2;

            const topLeft = new Pos(pos.x - halfWall, pos.y - halfWall);
            const bottRight = new Pos(pos.x + halfWall, pos.y + halfWall);

            if (this.isVisibleInClip(topLeft) || this.isVisibleInClip(bottRight)) {
                context.beginPath();

                const clipPos = this.clipPos(pos);
                context.arc(clipPos.x, clipPos.y, widthMargin, 0, 2 * Math.PI);
                context.fill();
            }
        }

        // draw players
        context.font = "8pt serif";

        for (const player of this.context.state.getPlayers()) {
            const name = "[" + player.name.replace(/[^\x00-\x7F]/g, "") + "," + player.id + "]";

            if (player.status === PLAYER_STATUS.ALIVE) {
                let pos = player.pos;
                if (!player.isVisibleOnScreen || player.stealthed || !pos) {
                    pos = player.lowResPos;
                }
                if (pos) {
                    if (this.isVisibleInClip(pos)) {
                        const clipPos = this.clipPos(pos);
                        context.fillStyle = "navy";
                        context.fillText(name, clipPos.x, clipPos.y);
                    }
                }
            }
        }

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

    private setClip(canvas: HTMLCanvasElement): void {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const myPos = this.context.state.getMe().pos;
        const halfWidth = canvas.width / 2;
        const halfHeight = canvas.height / 2;
        this.clip = [
            new Pos(myPos.x - halfWidth, myPos.y - halfHeight),
            new Pos(myPos.x + halfWidth, halfHeight),
        ];
    }

    private isVisibleInClip(pos: Pos): boolean {
        return this.clip[0].x < pos.x && this.clip[1].x > pos.x &&
            this.clip[0].y < pos.y && this.clip[1].y > pos.y;
    }

    private clipPos(pos: Pos): Pos {
        return new Pos(pos.x - this.clip[0].x, pos.y - this.clip[0].y);
    }
}
