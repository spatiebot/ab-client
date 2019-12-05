import { IMessageHandler } from "./imessage-handler";
import { Events } from "../events/constants";
import { EventMessage } from "../events/event-message";
import { ProtocolPacket, SERVER_PACKETS, decodeUpgrades, SERVER_MESSAGE_TYPES, SERVER_ERRORS } from "../ab-protocol/src/lib";
import { Context } from "../app-context/context";
import { ChatArgs } from "../events/event-args/chat-args";
import { ScoreBoard, ScoreDetailed, ScoreDetailedCtf } from "../ab-protocol/src/types/packets-server";

export class ServerMessageHandler implements IMessageHandler {

    handles = [Events.SERVER_MESSAGE];

    constructor(private context: Context) {

    }

    exec(ev: EventMessage): void {
        const serverMessage = ev.args as ProtocolPacket;
        switch (serverMessage.c) {
            case SERVER_PACKETS.CHAT_PUBLIC:
            case SERVER_PACKETS.CHAT_SAY:
            case SERVER_PACKETS.CHAT_TEAM:
            case SERVER_PACKETS.CHAT_WHISPER:
                this.context.eventQueue.pub(Events.CHAT, {
                    playerId: serverMessage.id || serverMessage.from,
                    chatMessage: serverMessage.text,
                    chatType: serverMessage.c
                } as ChatArgs);
                break;

            case SERVER_PACKETS.CHAT_VOTEMUTED:
                this.context.eventQueue.pub(Events.CHAT_NOT_POSSIBLE_BC_MUTED, serverMessage);
                break;

            case SERVER_PACKETS.CHAT_VOTEMUTEPASSED:
                this.context.eventQueue.pub(Events.CHAT_PLAYER_MUTED, serverMessage);
                break;

            case SERVER_PACKETS.COMMAND_REPLY:
                this.context.eventQueue.pub(Events.SERVER_COMMAND_REPLY, serverMessage);
                break;

            case SERVER_PACKETS.ERROR:
                this.context.eventQueue.pub(Events.SERVER_ERROR, serverMessage);
                break;

            case SERVER_PACKETS.EVENT_BOOST:
                this.context.eventQueue.pub(Events.PLAYER_BOOST, serverMessage);
                break;

            case SERVER_PACKETS.EVENT_BOUNCE:
                this.context.eventQueue.pub(Events.PLAYER_BOUNCE, serverMessage);
                break;

            case SERVER_PACKETS.EVENT_LEAVEHORIZON:
                this.context.eventQueue.pub(Events.LEAVE_HORIZON, serverMessage);
                break;

            case SERVER_PACKETS.EVENT_REPEL:
                this.context.eventQueue.pub(Events.PLAYER_REPEL, serverMessage);
                break;

            case SERVER_PACKETS.EVENT_STEALTH:
                this.context.eventQueue.pub(Events.PLAYER_STEALTH, serverMessage);
                break;

            case SERVER_PACKETS.GAME_FLAG:
                this.context.eventQueue.pub(Events.FLAG_UPDATE, serverMessage);
                break;

            case SERVER_PACKETS.LOGIN:
                this.context.eventQueue.pub(Events.LOGIN, serverMessage);
                break;

            case SERVER_PACKETS.MOB_DESPAWN:
                this.context.eventQueue.pub(Events.MOB_DESPAWN, serverMessage);
                break;

            case SERVER_PACKETS.MOB_DESPAWN_COORDS:
                this.context.eventQueue.pub(Events.MOUNTAIN_HIT, serverMessage);
                break;

            case SERVER_PACKETS.MOB_UPDATE:
                this.context.eventQueue.pub(Events.MISSILE_UPDATE, serverMessage);
                break;

            case SERVER_PACKETS.MOB_UPDATE_STATIONARY:
                this.context.eventQueue.pub(Events.CRATE_NEW, serverMessage);
                break;

            case SERVER_PACKETS.PLAYER_FIRE:
                this.context.eventQueue.pub(Events.PLAYER_FIRE, serverMessage);
                break;

            case SERVER_PACKETS.PLAYER_FLAG:
                this.context.eventQueue.pub(Events.PLAYER_CHANGE_FLAG, serverMessage);
                break;

            case SERVER_PACKETS.PLAYER_HIT:
                this.context.eventQueue.pub(Events.PLAYER_HIT, serverMessage);
                break;

            case SERVER_PACKETS.PLAYER_KILL:
                this.context.eventQueue.pub(Events.PLAYER_KILLED, serverMessage);
                break;

            case SERVER_PACKETS.PLAYER_LEAVE:
                this.context.eventQueue.pub(Events.PLAYER_LEAVE, serverMessage);
                break;

            case SERVER_PACKETS.PLAYER_NEW:
                this.context.eventQueue.pub(Events.PLAYER_NEW, serverMessage);
                break;

            case SERVER_PACKETS.PLAYER_POWERUP:
                this.context.eventQueue.pub(Events.PLAYER_POWERUP, serverMessage);
                break;

            case SERVER_PACKETS.PLAYER_UPDATE:
                this.context.eventQueue.pub(Events.PLAYER_UPDATE, serverMessage);
                break;

            case SERVER_PACKETS.PLAYER_RETEAM:
                this.context.eventQueue.pub(Events.TEAMS, serverMessage);
                break;

            case SERVER_PACKETS.PLAYER_UPGRADE:
                this.context.eventQueue.pub(Events.PLAYER_UPGRADE, serverMessage);
                break;

            case SERVER_PACKETS.PLAYER_RESPAWN:
                this.context.eventQueue.pub(Events.PLAYER_RESPAWN, serverMessage);
                break;

            case SERVER_PACKETS.PLAYER_TYPE:
                this.context.eventQueue.pub(Events.PLAYER_SWITCH_TYPE, serverMessage);
                break;

            case SERVER_PACKETS.SERVER_CUSTOM:
                this.context.eventQueue.pub(Events.SERVER_CUSTOM, serverMessage);
                break;

            case SERVER_PACKETS.SERVER_MESSAGE:
                this.context.eventQueue.pub(Events.SERVER_ANNOUNCEMENT, serverMessage);
                break;

            case SERVER_PACKETS.SCORE_BOARD:
                const scoreBoard = serverMessage as ScoreBoard;
                this.context.eventQueue.pub(Events.SCORE_BOARD, scoreBoard.data);
                this.context.eventQueue.pub(Events.MINI_MAP, scoreBoard.rankings);
                break;

            case SERVER_PACKETS.SCORE_DETAILED:
                const detailedFfa = serverMessage as ScoreDetailed;
                this.context.eventQueue.pub(Events.SCORE_DETAILED, { ffaScores: detailedFfa.scores });
                break;

            case SERVER_PACKETS.SCORE_DETAILED_CTF:
                const detailedCtf = serverMessage as ScoreDetailedCtf;
                this.context.eventQueue.pub(Events.SCORE_DETAILED, { ffaScores: detailedCtf.scores });
                break;

            case SERVER_PACKETS.SCORE_UPDATE:
                this.context.eventQueue.pub(Events.SCORE_UPDATE, serverMessage);
                break;

        }
    }

}