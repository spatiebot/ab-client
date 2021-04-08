import { CHAT_TYPE } from "../../ab-assets/chat-constants";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IChatArgs } from "../../events/event-args/chat-args";
import { EventMessage } from "../../events/event-message";
import { Random } from "../../helpers/random";
import { IMessageHandler } from "../imessage-handler";

export class ChatInstructionReceiver implements IMessageHandler {
    public handles = [Events.CHAT_RECEIVED];

    constructor(private context: IContext) {
    }

    public exec(ev: EventMessage) {
        const chat = ev.args as IChatArgs;

        const m = /\-sb\-kill\:\s(.+)/.exec(chat.chatMessage);
        if (m && m[1]) {
            const player = this.context.state.getPlayerByName(m[1].trim());
            if (player && player.id !== this.context.state.myPlayerId) {
                const random = Random.getRandomInt(0, 4);

                if (random === 0) {
                    this.context.botstate.playerToKill = chat.playerId;
                    this.context.connection.sendChat(CHAT_TYPE.CHAT, "Nah. I'd rather target you.");
                } else {
                    this.context.botstate.playerToKill = player.id;
                    this.context.connection.sendChat(CHAT_TYPE.CHAT, "Targeting " + player.name + ".");
                }
            }
        }
    }
}
