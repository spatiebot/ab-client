import { CommandReply, ServerMessage } from "../../ab-protocol/src/types/packets-server";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class ServerCommandReplyHandler implements IMessageHandler {

    public handles = [Events.SERVER_COMMAND_REPLY, Events.CHAT_NOT_POSSIBLE_BC_MUTED];

    constructor(private context: IContext) {

    }

    public exec(ev: EventMessage) {

        if (ev.type === Events.CHAT_NOT_POSSIBLE_BC_MUTED) {
            this.context.logger.warn("Chat not possible: you have been muted");
        } else {
            const msg = ev.args as CommandReply;

            if (msg.text === "Don't spam!") {
                this.context.eventQueue.pub(Events.SPAM_WARING_RECEIVED, {});
            }

            this.context.logger.warn("Server warning: " + msg.text);
        }
    }
}
