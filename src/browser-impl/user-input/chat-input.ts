import { CHAT_TYPE } from "../../ab-assets/chat-constants";
import { IContext } from "../../app-context/icontext";
import { Events } from "../../events/constants";
import { IChatSendArgs } from "../../events/event-args/ichat-send-args";
import { IMessageToPlayerArgs } from "../../events/event-args/message-to-player-args";
import { Player } from "../../models/player";

export class ChatInput {

    private input: HTMLInputElement;
    private commandRegex = /^\/(\w+)(?:\s(.+))?$/;

    constructor(private context: IContext) {
        this.input = document.getElementById("chat-input-textbox") as HTMLInputElement;
        this.input.addEventListener("blur", () => this.hide());
        this.hide();

        const instructionSpan = document.getElementById("input-instruction");
        instructionSpan.addEventListener("click", () => this.showAndFocus());
    }

    public showAndFocus() {
        this.input.style.display = "block";
        this.input.focus();
    }

    public hide() {
        this.input.style.display = "none";
    }

    public startChat(suggestedText: string) {
        this.showAndFocus();
        this.input.value = suggestedText;
    }

    public isChatInputFocused() {
        return this.input.style.display.toLowerCase() === "block";
    }

    public submit() {
        const text = this.input.value;

        if (text) {
            this.input.value = "";

            const commandMatch = this.commandRegex.exec(text);
            if (!commandMatch) {
                this.context.eventQueue.pub(Events.CHAT_SEND, { text, type: CHAT_TYPE.CHAT } as IChatSendArgs);
            } else {
                const command = commandMatch[1];
                const args = commandMatch[2];

                if (command === "t") {
                    this.context.eventQueue.pub(Events.CHAT_SEND,
                        { text: args, type: CHAT_TYPE.TEAM } as IChatSendArgs);
                } else if (command === "s") {
                    this.context.eventQueue.pub(Events.CHAT_SEND, { text: args, type: CHAT_TYPE.SAY } as IChatSendArgs);
                } else if (command === "w") {
                    const allPlayers = this.context.readState.getPlayers();
                    allPlayers.sort((a, b) => b.name.length - a.name.length);

                    let player: Player;
                    for (const targetPlayer of allPlayers) {
                        if (args.startsWith(targetPlayer.name)) {
                            player = targetPlayer;
                            break;
                        }
                    }

                    if (player) {
                        const whisperText = args.substr(player.name.length + 1);
                        this.context.eventQueue.pub(Events.CHAT_SEND,
                            {
                                playerId: player.id,
                                text: whisperText,
                                type: CHAT_TYPE.WHISPER,
                            } as IChatSendArgs);
                    } else {
                        this.context.eventQueue.pub(Events.MESSAGE_TO_PLAYER, {
                            message: "Unknown player, message not sent.",
                        } as IMessageToPlayerArgs);
                    }

                } else {
                    this.context.connection.sendCommand(command, args || "");
                }
            }
            this.hide();
        }
    }
}
