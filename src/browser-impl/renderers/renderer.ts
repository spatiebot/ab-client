import { CHAT_TYPE } from "../../ab-assets/chat-constants";
import { GAME_TYPES, SERVER_MESSAGE_TYPES } from "../../ab-protocol/src/lib";
import { IContext } from "../../app-context/icontext";
import { PeriodicLogger } from "../../helpers/periodic-logger";
import { StopWatch } from "../../helpers/stopwatch";
import { ClippedView } from "../clipped-view";
import { BackgroundRenderer } from "./background-renderer";
import { DebugInfoRenderer } from "./debug-info-renderer";
import { EffectsRenderer } from "./effects-renderer";
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
    private explosionsRenderer: EffectsRenderer;
    private upcratesRenderer: UpcratesRenderer;
    private backgroundRenderer: BackgroundRenderer;
    private minimapRenderer: MinimapRenderer;
    private playerListRenderer: PlayerListRenderer;
    private flagRenderer: FlagRenderer;
    private statsRenderer: StatsRenderer;
    private debugInfoRenderer: DebugInfoRenderer;

    private shakeTimeout: any;

    private ignoredPlayers: number[] = [];
    private periodicLogger: PeriodicLogger;

    constructor(private context: IContext) {

        this.getUiElements();

        this.periodicLogger = new PeriodicLogger(context);
        this.clip = new ClippedView(context);

        this.backgroundRenderer = new BackgroundRenderer(this.clip, context);
        this.wallsRenderer = new WallsRenderer(this.clip, context);
        this.flagRenderer = new FlagRenderer(context, this.clip);
        this.upcratesRenderer = new UpcratesRenderer(context, this.clip);
        this.playersRenderer = new PlayersRenderer(context, this.clip);
        this.missilesRenderer = new MissilesRenderer(context, this.clip);
        this.explosionsRenderer = new EffectsRenderer(context, this.clip);

        this.minimapRenderer = new MinimapRenderer(context);
        this.playerListRenderer = new PlayerListRenderer(context);
        this.statsRenderer = new StatsRenderer(context);

        this.debugInfoRenderer = new DebugInfoRenderer(context);
    }

    public addMessageToPlayer(msg: string) {
        this.chatBox.innerHTML += `<div class="chat chat-warning">${msg}</div>`;
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
    }

    public addChat(playerId: number, playerName: string, chatType: CHAT_TYPE, msg: string, to: number) {
        if (this.ignoredPlayers.indexOf(playerId) !== -1) {
            return;
        }

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

            const safePlayerName = encodeURI(playerName);

            this.chatBox.innerHTML += `<div class="chat ${type}"><strong class="player-name" ` +
                `data-name="${safePlayerName}" data-id="${playerId}">` +
                `${playerName}${typeLabel}</strong>: ${msg}</div>`;
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

    public highlightPlayerOnMinimap(playerId: number) {
        this.minimapRenderer.highlight(playerId);
    }

    public ignorePlayer(playerId: number) {
        if (this.ignoredPlayers.indexOf(playerId) === -1 && playerId !== this.context.state.id) {
            this.ignoredPlayers.push(playerId);
        }
    }

    public unignorePlayer(playerId: number) {
        this.ignoredPlayers = this.ignoredPlayers.filter((x) => x !== playerId);
    }

    public renderMinimap() {
        this.minimapRenderer.render();
    }

    public renderPlayerList() {
        this.playerListRenderer.render();
    }

    public renderHit() {
        this.canvas.className = "shake-hit";
        this.stopShaking();
    }

    public renderKill() {
        this.canvas.className = "shake-kill";
        this.stopShaking();
    }

    public renderGame(isFirstTick: boolean): void {
        if (isFirstTick) {
            // this may be the first tick after a panic,
            // purge any unnecessary stuff to keep up.
            this.context.state.purgeAfterPanic();
        }

        if (!this.context.state.getMe()) {
            return;
        }

        const canvasCtx = this.canvasContext;
        this.clip.setClip(this.canvas);

        // background
        this.backgroundRenderer.renderBackground(canvasCtx);
        // draw walls
        this.wallsRenderer.renderWalls(canvasCtx);
        // upgrade and powerup crates
        this.upcratesRenderer.renderUpcrates(canvasCtx);
        // draw players
        this.playersRenderer.renderPlayers(canvasCtx);
        // draw missiles
        this.missilesRenderer.renderMissiles(canvasCtx);
        // explosions and kills
        this.explosionsRenderer.renderExplosions(canvasCtx);

        if (this.context.gameType === GAME_TYPES.CTF) {
            this.flagRenderer.render(canvasCtx);
        }

        this.debugInfoRenderer.render();
    }

    private getUiElements() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext("2d");

        this.chatBox = document.getElementById("chat") as HTMLDivElement;
        this.serverMessage = document.getElementById("server-message") as HTMLDivElement;
        this.pingElement = document.getElementById("stats-ping") as HTMLSpanElement;
    }

    private stopShaking() {
        if (this.shakeTimeout) {
            this.context.tm.clearTimeout(this.shakeTimeout);
        }
        this.shakeTimeout = this.context.tm.setTimeout(() => this.canvas.className = "", 1000);
    }

}
