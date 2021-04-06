import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IBotInstructionArgs } from "../../events/event-args/ibot-instruction-args";
import { EventMessage } from "../../events/event-message";
import { IMessageHandler } from "../imessage-handler";

export class BotSteeringInstructionHandler implements IMessageHandler {
    public handles = [Events.BOT_STEERING_INSTRUCTION];

    constructor(private context: IContext) {
    }

    public exec(ev: EventMessage) {
        const instruction = ev.args as IBotInstructionArgs;

        this.context.connection.sendKey(instruction.keyToSend, instruction.keyState);
    }
}
