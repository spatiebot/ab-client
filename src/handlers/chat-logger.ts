import { IContext } from "../app-context/icontext";
import { Events } from "../events/constants";
import { IChatArgs } from "../events/event-args/chat-args";
import { EventMessage } from "../events/event-message";
import { IMessageHandler } from "./imessage-handler";

export class ChatLogger implements IMessageHandler {
    public handles = [Events.CHAT_RECEIVED];

    constructor(private context: IContext) {
    }

    public exec(ev: EventMessage) {
        const chat = ev.args as IChatArgs;
        const player = this.context.state.getPlayerName(chat.playerId);

        this.context.logger.info(`${player} says "${chat.chatMessage}"`);
    }
}
