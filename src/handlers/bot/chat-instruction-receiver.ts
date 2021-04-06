import { KEY_CODES } from "../../ab-protocol/src/lib";
import { Events } from "../../events/constants";
import { IChatArgs } from "../../events/event-args/chat-args";
import { IBotInstructionArgs } from "../../events/event-args/ibot-instruction-args";
import { EventMessage } from "../../events/event-message";
import { PathFinding } from "../../node-impl/botting/path-finding";
import { NodeContext } from "../../node-impl/node-context";
import { IMessageHandler } from "../imessage-handler";

export class ChatInstructionReceiver implements IMessageHandler {
    public handles = [Events.CHAT_RECEIVED];

    private lastKey: KEY_CODES;

    constructor(private context: NodeContext) {
    }

    public exec(ev: EventMessage) {
        const chat = ev.args as IChatArgs;
        const player = this.context.state.getPlayerById(chat.playerId);

        if (player.name.indexOf("patie") === 0) {
            return;
        }

        let keyToSend: KEY_CODES;
        let keyState = true;
        if (chat.chatMessage === 'left') {
            keyToSend = KEY_CODES.LEFT;
        } else if (chat.chatMessage === 'right') {
            keyToSend = KEY_CODES.RIGHT;
        } else if (chat.chatMessage === 'followme') {
            this.context.botstate.followId = chat.playerId;
        } else {
            keyToSend = this.lastKey;
            keyState = false;
            this.context.botstate.followId = null;
        }

        if (keyToSend) {
            this.lastKey = keyToSend;
            this.context.eventQueue.pub(Events.BOT_STEERING_INSTRUCTION, { keyToSend, keyState } as IBotInstructionArgs);
        }
    }
}
