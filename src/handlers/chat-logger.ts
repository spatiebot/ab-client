import { IMessageHandler } from "./imessage-handler";
import { Events } from "../events/constants";
import { EventMessage } from "../events/event-message";
import { Context } from "../app-context/context";
import { ChatArgs } from "../events/event-args/chat-args";

export class ChatLogger implements IMessageHandler {
    handles = [Events.CHAT];

    constructor(private context: Context) {
    }

    exec(ev: EventMessage) {
        const chat = ev.args as ChatArgs;
        const player = this.context.state.getPlayerName(chat.playerId);

        this.context.logger.info(`${player} says "${chat.chatMessage}"`);
    }
}