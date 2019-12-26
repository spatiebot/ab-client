import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { IChatArgs } from "../../events/event-args/chat-args";
import { IMessageToPlayerArgs } from "../../events/event-args/message-to-player-args";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ChatRenderHandler implements IMessageHandler {
    public handles = [Events.CHAT_RECEIVED, Events.MESSAGE_TO_PLAYER];

    constructor(private context: BrowserContext) {
    }

    public exec(ev: EventMessage) {
        if (ev.type === Events.MESSAGE_TO_PLAYER) {
            const msg = ev.args as IMessageToPlayerArgs;
            this.context.renderer.addMessageToPlayer(msg.message);
        } else {
            const chat = ev.args as IChatArgs;
            const player = this.context.state.getPlayerName(chat.playerId);

            this.context.renderer.addChat(chat.playerId, player, chat.chatType, chat.chatMessage, chat.to);
        }
    }
}
