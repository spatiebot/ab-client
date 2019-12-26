import { CommandReply, ServerMessage } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IMessageToPlayerArgs } from "../../events/event-args/message-to-player-args";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ServerCommandReplyHandler implements IMessageHandler {

    public handles = [Events.SERVER_COMMAND_REPLY, Events.CHAT_NOT_POSSIBLE_BC_MUTED];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {

        if (ev.type === Events.CHAT_NOT_POSSIBLE_BC_MUTED) {
            this.context.eventQueue.pub(Events.MESSAGE_TO_PLAYER, {
                message: "You have been muted.",
            } as IMessageToPlayerArgs);
        } else {
            const msg = ev.args as CommandReply;

            if (msg.text === "Don't spam!") {
                this.context.eventQueue.pub(Events.SPAM_WARING_RECEIVED, {});
            }

            this.context.eventQueue.pub(Events.MESSAGE_TO_PLAYER, {
                message: msg.text,
            } as IMessageToPlayerArgs);
        }
    }
}
