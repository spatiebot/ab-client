import { CHAT_TYPE } from "../ab-assets/chat-constants";
import { KEY_CODES } from "../ab-protocol/src/lib";
import * as marshaling from "../ab-protocol/src/marshaling";
import { ProtocolPacket } from "../ab-protocol/src/packets";
import CLIENT_PACKETS from "../ab-protocol/src/packets/client";
import SERVER_PACKETS from "../ab-protocol/src/packets/server";
import { Backup, Chat, Command, Horizon, Key, Votemute } from "../ab-protocol/src/types/packets-client";
import { Login, Ping, PingResult } from "../ab-protocol/src/types/packets-server";
import * as unmarshaling from "../ab-protocol/src/unmarshaling";
import { IContext } from "../app-context/icontext";
import { Events } from "../events/constants";
import { PeriodicLogger } from "../helpers/periodic-logger";
import { StopWatch } from "../helpers/stopwatch";

const FPS = 60;
const MS_PER_SEC = 1000;
const TICK_MS = MS_PER_SEC / FPS;

export class Connection {

    private client: WebSocket;
    private backupClient: WebSocket;
    private backupClientIsConnected: boolean;
    private ackToBackup: boolean;
    private ackInterval: any;
    private keySequenceNumber: number = 0;
    private loginPromiseResolver: (value?: any) => void;

    private serverClockCalibrationTime: number;
    private serverClockCalbirationTimeResetStopwatch: StopWatch;
    private lagMs = 0;
    private lastReceivedMessages: { [key: string]: StopWatch } = {};
    private lastReceivedMessagesGcStopwatch = new StopWatch();

    private logger: PeriodicLogger;

    constructor(private context: IContext) {
        this.logger = new PeriodicLogger(context, 2);
    }

    public async init(): Promise<any> {
        this.client = await this.initWebSocket(true);
        await this.onInitPrimary();
    }

    public sendKey(key: KEY_CODES, state: boolean) {
        this.keySequenceNumber++;
        const msg = {
            c: CLIENT_PACKETS.KEY,
            key,
            seq: this.keySequenceNumber,
            state,
        } as Key;
        this.send(msg);
        if (this.backupClientIsConnected) {
            this.send(msg, true);
        }
    }

    public sendCommand(command: string, params: string) {
        const msg = {
            c: CLIENT_PACKETS.COMMAND,
            com: command,
            data: params,
        } as Command;
        this.send(msg);
    }

    public voteMute(playerId: number) {
        const msg = {
            c: CLIENT_PACKETS.VOTEMUTE,
            id: playerId,
        } as Votemute;
        this.send(msg);
    }

    public fetchDetailedScore() {
        this.send({ c: CLIENT_PACKETS.SCOREDETAILED });
    }

    public sendChat(type: CHAT_TYPE, text: string, targetPlayerID: number = null): void {
        let c: number;
        switch (type) {
            case CHAT_TYPE.CHAT:
                c = CLIENT_PACKETS.CHAT;
                break;
            case CHAT_TYPE.SAY:
                c = CLIENT_PACKETS.SAY;
                break;
            case CHAT_TYPE.TEAM:
                c = CLIENT_PACKETS.TEAMCHAT;
                break;
            case CHAT_TYPE.WHISPER:
                c = CLIENT_PACKETS.WHISPER;
                break;
        }

        const msg = {
            c,
            id: targetPlayerID,
            text,
        } as Chat;

        this.send(msg);
    }

    public sendScreenSize(width: number, height: number) {
        this.send({
            c: CLIENT_PACKETS.HORIZON,
            horizonX: Math.ceil(width / 2),
            horizonY: Math.ceil(height / 2),
        } as Horizon);
    }

    public getLagMs() {
        return this.lagMs;
    }

    private onInitPrimary(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.loginPromiseResolver = resolve;
            this.context.logger.debug("Primary socket connecting");
            this.send({
                c: CLIENT_PACKETS.LOGIN,
                flag: this.context.settings.flag,
                horizonX: Math.ceil(this.context.settings.horizonX),
                horizonY: Math.ceil(this.context.settings.horizonY),
                name: this.context.settings.playerName,
                protocol: 5,
                session: "none",
            });
        });
    }

    private async afterLogin(msg: Login) {
        // send regular ack messages to keep the connection alive
        if (this.ackInterval) {
            this.context.tm.clearInterval(this.ackInterval);
        }
        this.ackInterval = this.context.tm.setInterval(() => {
            this.send({ c: CLIENT_PACKETS.ACK }, this.ackToBackup);
            this.ackToBackup = !this.ackToBackup;
        }, 1000); // original airmash has 50ms, but wights server has a 10 second ack timeout. So.

        const token = msg.token as string;

        if (this.backupClientIsConnected) {
            this.backupClient.close();
            this.backupClientIsConnected = false;
        }
        this.backupClient = await this.initWebSocket(false);
        this.onInitBackup(token);

        // send start info to game
        this.context.eventQueue.pub(Events.SERVER_MESSAGE, msg);

        // return from the await in init()
        this.loginPromiseResolver();
    }

    private resetCalibration(newTime: number) {
        this.serverClockCalbirationTimeResetStopwatch = new StopWatch();
        this.serverClockCalibrationTime = newTime;
        this.lagMs = 0;
    }

    private onInitBackup(token: any) {
        this.context.logger.debug("Backup socket connecting");
        this.backupClientIsConnected = true;
        this.send({
            c: CLIENT_PACKETS.BACKUP,
            token,
        } as Backup, true);
    }

    private initWebSocket(isPrimary: boolean): Promise<WebSocket> {
        return new Promise((resolve, reject) => {
            const ws = this.context.webSocketFactory.create(this.context.settings.websocketUrl);
            ws.binaryType = "arraybuffer";

            ws.onopen = () => resolve(ws);
            ws.onmessage = (msg: { data: ArrayBuffer }) => {
                try {
                    const result = unmarshaling.unmarshalServerMessage(msg.data);
                    if (!result) {
                        this.context.logger.warn("no result", msg);
                        return;
                    }

                    this.calibrateTime(result);

                    if (this.shouldDropMessage(result)) {
                        return;
                    }

                    // handle a few meta messages directly
                    if (result.c === SERVER_PACKETS.PING) {
                        const pingResult = result as Ping;
                        this.send({ c: CLIENT_PACKETS.PONG, num: pingResult.num }, !isPrimary);

                    } else if (result.c === SERVER_PACKETS.BACKUP) {

                        this.context.logger.debug("backup client connected");
                        this.backupClientIsConnected = true;

                    } else if (result.c === SERVER_PACKETS.LOGIN) {
                        this.afterLogin(result);
                    } else if (result.c === SERVER_PACKETS.PING_RESULT) {
                        const pingResultResult = result as PingResult;
                        this.context.state.ping = pingResultResult.ping;
                        this.context.state.numPlayers = pingResultResult.playersgame;
                        this.context.state.numPlayersTotal = pingResultResult.playerstotal;

                    } else {
                        // let most messages be handled by a subscriber
                        this.context.eventQueue.pub(Events.SERVER_MESSAGE, result);
                    }
                } catch (error) {
                    this.context.logger.error("Error receiving message", error);
                }
            };
            ws.onerror = (ev) => {
                this.context.eventQueue.pub(Events.CONNECTION_ERROR, ev);
            };
            ws.onclose = () => {
                this.context.eventQueue.pub(Events.CONNECTION_CLOSE, { isPrimary });
            };
            return ws;
        });
    }

    private calibrateTime(msg: ProtocolPacket) {
        if (!msg.clock) {
            return;
        }

        const currentServerClock = msg.clock as number / 100;

        if (!this.serverClockCalbirationTimeResetStopwatch ||
            this.serverClockCalbirationTimeResetStopwatch.elapsedMinutes > 5) {
            this.resetCalibration(currentServerClock);
        }

        const elapsedOnServer = currentServerClock - this.serverClockCalibrationTime;
        const elapsedHere = this.serverClockCalbirationTimeResetStopwatch.elapsedMs;
        const diffInMs = elapsedOnServer - elapsedHere;

        this.lagMs = diffInMs;
    }

    private shouldDropMessage(msg: ProtocolPacket): boolean {
        if (!msg.id || !msg.clock || msg.id !== this.context.state.id) {
            return false;
        }

        // do GC
        if (this.lastReceivedMessagesGcStopwatch.elapsedSeconds > 5) {
            for (const existingKey of Object.keys(this.lastReceivedMessages)) {
                if (this.lastReceivedMessages[existingKey].elapsedSeconds > 1) {
                    delete this.lastReceivedMessages[existingKey];
                }
            }
        }

        const key = `${msg.c}_${msg.clock}`;

        if (this.lastReceivedMessages[key]) {
            return true;
        }

        this.lastReceivedMessages[key] = new StopWatch();
        return false;
    }

    private send(msg: ProtocolPacket, sendToBackup = false) {
        const clientMgs = marshaling.marshalClientMessage(msg);
        if (sendToBackup) {
            if (this.backupClientIsConnected) {
                this.backupClient.send(clientMgs);
            }
        } else {
            if (this.client) {
                this.client.send(clientMgs);
            }
        }
    }

}
