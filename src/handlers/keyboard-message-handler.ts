import { IContext } from "../app-context/icontext";
import { Events } from "../events/constants";
import { IKeyboardArgs } from "../events/event-args/ikeyboard-args";
import { EventMessage } from "../events/event-message";
import { IMessageHandler } from "./imessage-handler";

export class KeyboardMessageHandler implements IMessageHandler {
    public handles = [Events.KEYBOARD];

    constructor(private context: IContext) {
    }

    public exec(ev: EventMessage) {
        const keyArgs = ev.args as IKeyboardArgs;

        this.context.connection.sendKey(keyArgs.key, keyArgs.state);
    }

}
