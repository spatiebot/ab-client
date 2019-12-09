import { IContext } from "../app-context/icontext";
import { Events } from "../events/constants";
import { IChatSendArgs } from "../events/event-args/ichat-send-args";
import { EventMessage } from "../events/event-message";
import { IMessageHandler } from "./imessage-handler";

export class ChatSendHandler implements IMessageHandler {
    public handles = [Events.CHAT_SEND];

    constructor(private context: IContext) {
    }

    public exec(ev: EventMessage) {
        const args = ev.args as IChatSendArgs;

        this.context.connection.sendChat(args.type, args.text, args.playerId);
    }
}
