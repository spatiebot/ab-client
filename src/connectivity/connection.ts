import * as marshaling from '../ab-protocol/src/marshaling';
import * as unmarshaling from '../ab-protocol/src/unmarshaling';
import { Context } from "../app-context/context";
import { ProtocolPacket } from '../ab-protocol/src/packets';
import CLIENT_PACKETS from '../ab-protocol/src/packets/client';
import SERVER_PACKETS from '../ab-protocol/src/packets/server';
import { Events } from '../events/constants';
import WebSocket from 'ws';
import { Ping, Login, PingResult } from '../ab-protocol/src/types/packets-server';

export class Connection {

    private client: WebSocket;
    private backupClient: WebSocket;
    private backupClientIsConnected: boolean;
    private ackToBackup: boolean;
    private ackInterval: any;
    private loginPromiseResolver: (value?: any) => void;

    constructor(private context: Context) {
    }

    async init(): Promise<any> {
        this.client = await this.initWebSocket(true);
        await this.onInitPrimary();
    }

    private onInitPrimary(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.loginPromiseResolver = resolve;
            this.context.logger.debug("Primary socket connecting");
            this.send({
                c: CLIENT_PACKETS.LOGIN,
                protocol: 5,
                name: this.context.settings.playerName,
                session: "none",
                horizonX: Math.ceil(this.context.settings.horizonX),
                horizonY: Math.ceil(this.context.settings.horizonY),
                flag: this.context.settings.flag
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

        var token = msg.token as string;

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

    private onInitBackup(token: any) {
        this.context.logger.debug("Backup socket connecting");
        this.backupClientIsConnected = true;
        this.send({
            c: CLIENT_PACKETS.BACKUP,
            token
        }, true);
    }

    private initWebSocket(isPrimary: boolean): Promise<WebSocket> {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(this.context.settings.websocketUrl);
            ws.binaryType = "arraybuffer";

            ws.onopen = () => resolve(ws);
            ws.onmessage = (msg: { data: ArrayBuffer }) => {
                try {
                    const result = unmarshaling.unmarshalServerMessage(msg.data);
                    if (!result) {
                        this.context.logger.warn('no result', msg);
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
                    }else if (result.c === SERVER_PACKETS.PING_RESULT) {
                        const pingResultResult = result as PingResult;
                        this.context.state.ping = pingResultResult.ping;
                        this.context.state.numPlayers = pingResultResult.playersgame;
                        this.context.state.numPlayersTotal = pingResultResult.playerstotal;
                    
                    } else {
                        // let most messages be handled by a subscriber
                        this.context.eventQueue.pub(Events.SERVER_MESSAGE, result);
                    }
                } catch (error) {
                    this.context.logger.error('Error receiving message', error);
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

    private send(msg: ProtocolPacket, sendToBackup = false) {
        const clientMgs = marshaling.marshalClientMessage(msg);
        if (sendToBackup) {
            if (this.backupClientIsConnected) {
                this.backupClient.send(clientMgs);
            }
        } else {
            this.client.send(clientMgs);
        }
    }
}