import { KEY_CODES, KEY_NAMES } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { Events } from "../events/constants";
import { IKeyboardArgs } from "../events/event-args/ikeyboard-args";
import { ChatInput } from "./chat-input";

export class KeyboardInput {

    constructor(private context: IContext, private chatInput: ChatInput) {
        document.addEventListener("keydown", (e) => this.onKey(e, true));
        document.addEventListener("keyup", (e) => this.onKey(e, false));
    }

    private onKey(e: KeyboardEvent, isKeyDown: boolean) {

        const hasInputFocus = ((e.target as HTMLElement).nodeName.toLowerCase() === "input");

        let keyToSend: KEY_CODES;
        switch (e.keyCode) {
            case 17: // Control
                keyToSend = KEY_CODES.SPECIAL;
                break;

            case 32: // Space
                keyToSend = KEY_CODES.FIRE;
                break;

            case 37: // Left
                keyToSend = KEY_CODES.LEFT;
                break;

            case 38: // Up
                keyToSend = KEY_CODES.UP;
                break;

            case 39: // Right
                keyToSend = KEY_CODES.RIGHT;
                break;

            case 40: // Down
                keyToSend = KEY_CODES.DOWN;
                break;

            case 13: // Enter
                if (isKeyDown) {
                    this.chatInput.showAndFocus();
                }
                break;

            case 27: // esc
                if (isKeyDown) {
                    this.chatInput.hide();
                }
                break;
        }

        if (!hasInputFocus && keyToSend) {
            this.context.eventQueue.pub(Events.KEYBOARD, { key: keyToSend, state: isKeyDown } as IKeyboardArgs);
        }
    }
}
