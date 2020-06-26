import { KEY_CODES } from "../../ab-protocol/src/lib";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IKeyboardArgs } from "../../events/event-args/ikeyboard-args";
import { AircraftSelection } from "./aircraft-selection";
import { ApplyUpgrades } from "./apply-upgrades";
import { ChatInput } from "./chat-input";
import { PlayerDropDownMenu } from "./player-dropdownmenu";
import { DropFlag } from "./drop-flag";
import { AutoFire } from "./auto-fire";
import { Spectate } from "./spectate";

export class KeyboardAndMouseInput {

    constructor(
        private context: IContext,
        private chatInput: ChatInput,
        private applyUpgrades: ApplyUpgrades,
        private dropFlag: DropFlag,
        private autoFire: AutoFire,
        private spectate: Spectate,
        private aircraftSelection: AircraftSelection,
        private playerDropdownMenu: PlayerDropDownMenu) {

        document.addEventListener("keydown", (e) => this.onKey(e, true));
        document.addEventListener("keyup", (e) => this.onKey(e, false));

        const canvas = document.getElementById("canvas");
        canvas.addEventListener("mousedown", (e) => this.onMouseFire(e, true));
        canvas.addEventListener("mouseup", (e) => this.onMouseFire(e, false));

        // listen for clicks on usernames in chat and player list
        const chat = document.getElementById("chat");
        const playerList = document.getElementById("player-list");
        chat.addEventListener("mouseup", (e) => this.onMouseUpInChatOrPlayerList(e, false));
        chat.addEventListener("contextmenu", (e) => this.onMouseUpInChatOrPlayerList(e, true));
        playerList.addEventListener("mouseup", (e) => this.onMouseUpInChatOrPlayerList(e, false));
        playerList.addEventListener("contextmenu", (e) => this.onMouseUpInChatOrPlayerList(e, true));
    }

    private onMouseUpInChatOrPlayerList(e: MouseEvent, isContextMenu: boolean) {
        // if the landing page is still shown, do nothing here
        if (!this.context.isActive) {
            return;
        }

        const element = e.target as HTMLElement;
        if (!element.className || element.className.indexOf("player-name") === -1) {
            this.playerDropdownMenu.hide();
            return;
        }

        if (!isContextMenu && e.button === 2) {
            // regular right-click will be handled by contextmenu event.
            return;
        }

        const playerName = element.dataset.name;
        const playerId = element.dataset.id;

        this.playerDropdownMenu.show(e.x, e.y, playerId, playerName);

        e.preventDefault();
        e.stopPropagation();
    }

    private onMouseFire(e: MouseEvent, isButtonDown: boolean) {
        // if the landing page is still shown, do nothing here
        if (!this.context.isActive) {
            return;
        }

        this.context.eventQueue.pub(Events.KEYBOARD, { key: KEY_CODES.FIRE, state: isButtonDown } as IKeyboardArgs);

        this.playerDropdownMenu.hide();
    }

    private onKey(e: KeyboardEvent, isKeyDown: boolean) {

        // if the landing page is still shown, do nothing here
        if (!this.context.isActive) {
            return;
        }

        const isChatInputFocused = this.chatInput.isChatInputFocused();

        // do limited key detection when typing in the chat box
        if (isChatInputFocused) {
            if (isKeyDown) {
                if (e.keyCode === 27) {
                    this.chatInput.hide();
                }

                if (e.keyCode === 13) {
                    this.chatInput.submit();
                }
            }
            return;
        }

        let preventDefault = false;
        let keyToSend: KEY_CODES;
        switch (e.keyCode) {
            case 16: // Shift
            case 17: // Control
                keyToSend = KEY_CODES.SPECIAL;
                break;

            case 32: // Space
                keyToSend = KEY_CODES.FIRE;
                break;

            case 65: // A
            case 37: // Left
                preventDefault = true;
                keyToSend = KEY_CODES.LEFT;
                break;

            case 87: // W
            case 38: // Up
                preventDefault = true;
                keyToSend = KEY_CODES.UP;
                break;

            case 68: // D
            case 39: // Right
                preventDefault = true;
                keyToSend = KEY_CODES.RIGHT;
                break;

            case 83: // S
            case 40: // Down
                preventDefault = true;
                keyToSend = KEY_CODES.DOWN;
                break;

            case 13: // Enter
                if (isKeyDown) {
                    this.chatInput.showAndFocus();
                }
                break;

            case 86: // v
                if (isKeyDown) {
                    this.spectate.spectate();
                }
                break;

            case 88: // x
                if (isKeyDown) {
                    this.applyUpgrades.dropUpgrade();
                }
                break;

            case 89: // y
                if (isKeyDown) {
                    this.dropFlag.dropFlag();
                }
                break;

            case 90: // z
                if (isKeyDown) {
                    this.autoFire.toggleAutoFire();
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
                preventDefault = true;
                if (isKeyDown) {
                    this.aircraftSelection.selectAircraft("" + (e.keyCode - 111));
                }

        }

        if (keyToSend) {
            this.context.eventQueue.pub(Events.KEYBOARD, { key: keyToSend, state: isKeyDown } as IKeyboardArgs);
        }

        if (preventDefault) {
            e.stopPropagation();
            e.preventDefault();
        }
    }
}
