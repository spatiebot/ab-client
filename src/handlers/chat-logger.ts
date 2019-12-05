import { IMessageHandler } from "./imessage-handler";
import { Events } from "../events/constants";
import { EventMessage } from "../events/event-message";
import { ChatArgs } from "../events/event-args/chat-args";
import { IContext } from "../app-context/icontext";

export class ChatLogger implements IMessageHandler {
    handles = [Events.CHAT];

    constructor(private context: IContext) {
    }

    exec(ev: EventMessage) {
        const chat = ev.args as ChatArgs;
        const player = this.context.state.getPlayerName(chat.playerId);

        this.context.logger.info(`${player} says "${chat.chatMessage}"`);
    }
}