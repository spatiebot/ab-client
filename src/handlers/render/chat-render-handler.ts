import { IContext } from "../../app-context/icontext";
import { BrowserContext } from "../../browser-impl/browser-context";
import { Events } from "../../events/constants";
import { ChatArgs } from "../../events/event-args/chat-args";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ChatRenderHandler implements IMessageHandler {
    public handles = [Events.CHAT];

    constructor(private context: BrowserContext) {
    }

    public exec(ev: EventMessage) {
        const chat = ev.args as ChatArgs;
        const player = this.context.state.getPlayerName(chat.playerId);

        this.context.renderer.addChat(player, chat.chatMessage);
    }
}
