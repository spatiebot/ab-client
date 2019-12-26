import { CHAT_TYPE } from "../../ab-assets/chat-constants";
import { GAME_TYPES, SERVER_MESSAGE_TYPES } from "../../ab-protocol/src/lib";
import { IContext } from "../../app-context/icontext";
import { PeriodicLogger } from "../../helpers/periodic-logger";
import { StopWatch } from "../../helpers/stopwatch";
import { ClippedView } from "../clipped-view";
import { BackgroundRenderer } from "./background-renderer";
import { ExplosionsRenderer } from "./explosions-renderer";
import { FlagRenderer } from "./flag-renderer";
import { MinimapRenderer } from "./minimap-renderer";
import { MissilesRenderer } from "./missiles-renderer";
import { PlayerListRenderer } from "./playerlist-renderer";
import { PlayersRenderer } from "./players-renderer";
import { StatsRenderer } from "./stats-renderer";
import { UpcratesRenderer } from "./upcrates-renderer";
import { WallsRenderer } from "./walls-renderer";

export class Renderer {
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;

    private chatBox: HTMLDivElement;
    private serverMessage: HTMLDivElement;
    private serverMessageStopwatch: StopWatch;

    private pingElement: HTMLSpanElement;

    private clip: ClippedView;
    private playersRenderer: PlayersRenderer;
    private wallsRenderer: WallsRenderer;
    private missilesRenderer: MissilesRenderer;
    private explosionsRenderer: ExplosionsRenderer;
    private upcratesRenderer: UpcratesRenderer;
    private backgroundRenderer: BackgroundRenderer;
    private minimapRenderer: MinimapRenderer;
    private playerListRenderer: PlayerListRenderer;
    private flagRenderer: FlagRenderer;
    private statsRenderer: StatsRenderer;

    private periodicLogger: PeriodicLogger;

    constructor(private context: IContext) {

        this.getUiElements();

        this.periodicLogger = new PeriodicLogger(context);
        this.clip = new ClippedView(context);

        this.backgroundRenderer = new BackgroundRenderer(this.clip, context);
        this.wallsRenderer = new WallsRenderer(this.clip);
        this.flagRenderer = new FlagRenderer(context, this.clip);
        this.upcratesRenderer = new UpcratesRenderer(context, this.clip);
        this.playersRenderer = new PlayersRenderer(context, this.clip);
        this.missilesRenderer = new MissilesRenderer(context, this.clip);
        this.explosionsRenderer = new ExplosionsRenderer(context, this.clip);

        this.minimapRenderer = new MinimapRenderer(context);
        this.playerListRenderer = new PlayerListRenderer(context);
        this.statsRenderer = new StatsRenderer(context);
    }

    public addMessageToPlayer(msg: string) {
        this.chatBox.innerHTML += `<div class="chat chat-warning">${msg}</div>`;
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }

    public addChat(playerId: number, playerName: string, chatType: CHAT_TYPE, msg: string, to: number) {
        playerName = playerName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (chatType === CHAT_TYPE.SAY) {
            this.playersRenderer.addSay(playerId, msg);
        } else {
            let type = "";
            let typeLabel = "";
            if (chatType === CHAT_TYPE.TEAM) {
                type = "chat-team";
                typeLabel = " =&gt; team";
            } else if (chatType === CHAT_TYPE.WHISPER) {
                type = "chat-whisper";
                if (playerId === this.context.state.id) {
                    const other = this.context.state.getPlayerName(to);
                    typeLabel = " =&gt; " + other;
                } else {
                    typeLabel = " =&gt; me";
                }
            }

            this.chatBox.innerHTML += `<div class="chat ${type}"><strong>${playerName}${typeLabel}</strong>: ${msg}</div>`;
            this.chatBox.scrollTop = this.chatBox.scrollHeight;
        }

    }

    public showServerMessage(type: SERVER_MESSAGE_TYPES, durationMs: number, text: string) {
        this.serverMessageStopwatch = new StopWatch(durationMs);
        this.serverMessage.innerHTML = text;
    }

    public hideServerMessageAfterTimeout() {
        if (!this.serverMessageStopwatch) {
            return;
        }

        if (this.serverMessageStopwatch.hasTimedOut) {
            this.serverMessage.innerHTML = "";
            this.serverMessageStopwatch = null;
        }
    }

    public showStats() {
        this.statsRenderer.render();
    }

    public showPing() {
        this.pingElement.innerText = "" + this.context.state.ping + " ms";
    }

    public renderMinimap() {
        this.minimapRenderer.render();
    }

    public renderPlayerList() {
        this.playerListRenderer.render();
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

        if (this.context.gameType === GAME_TYPES.CTF) {
            this.flagRenderer.render(context);
        }
    }

    private getUiElements() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext("2d");

        this.chatBox = document.getElementById("chat") as HTMLDivElement;
        this.serverMessage = document.getElementById("server-message") as HTMLDivElement;
        this.pingElement = document.getElementById("stats-ping") as HTMLSpanElement;
    }
}
