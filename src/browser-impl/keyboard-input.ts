import { KEY_CODES, KEY_NAMES } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { Events } from "../events/constants";
import { IKeyboardArgs } from "../events/event-args/ikeyboard-args";
import { AircraftSelection } from "./aircraft-selection";
import { ApplyUpgrades } from "./apply-upgrades";
import { ChatInput } from "./chat-input";

export class KeyboardInput {

    constructor(
        private context: IContext,
        private chatInput: ChatInput,
        private applyUpgrades: ApplyUpgrades,
        private aircraftSelection: AircraftSelection) {

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

            case 88: // x
                if (isKeyDown) {
                    this.applyUpgrades.dropUpgrade();
                }
                break;

            case 49: // 1
            case 50: // 2
            case 51: // 3
            case 52: // 4
                if (isKeyDown) {
                    this.applyUpgrades.applyUpgrade("" + (e.keyCode - 48));
                }
                break;

            case 112: // F1
            case 113: // F2
            case 114: // F3
            case 115: // F4
            case 116: // F5
                if (isKeyDown) {
                    this.aircraftSelection.selectAircraft("" + (e.keyCode - 111));
                }

        }

        if (!hasInputFocus && keyToSend) {
            this.context.eventQueue.pub(Events.KEYBOARD, { key: keyToSend, state: isKeyDown } as IKeyboardArgs);
        }

        e.stopPropagation();
        e.preventDefault();
    }
}
