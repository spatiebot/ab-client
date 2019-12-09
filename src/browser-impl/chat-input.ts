import { CHAT_TYPE } from "../ab-assets/chat-constants";
import { IContext } from "../app-context/icontext";
import { Events } from "../events/constants";
import { IChatArgs } from "../events/event-args/chat-args";
import { IChatSendArgs } from "../events/event-args/ichat-send-args";

export class ChatInput {

    private input: HTMLInputElement;
    private commandRegex = /^\/(\w+)\s(.+)$/;
    private whisperRegex = /^(\w+)\s(\w+)$/;

    constructor(private context: IContext) {
        this.input = document.getElementById("chat-input-textbox") as HTMLInputElement;
        this.input.addEventListener("change", () => this.onChatInput());
        this.hide();
    }

    public showAndFocus() {
        this.input.style.display = "block";
        this.input.focus();
    }

    public hide() {
        this.input.style.display = "none";
    }

    private onChatInput() {
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
                    const whisperMatch = this.whisperRegex.exec(args);
                    if (!whisperMatch) {
                        this.context.eventQueue.pub(Events.CHAT_SEND, { text, type: CHAT_TYPE.CHAT } as IChatSendArgs);
                    } else {
                        const player = this.context.state.getPlayerByName(whisperMatch[1]);
                        if (player) {
                            this.context.eventQueue.pub(Events.CHAT_SEND,
                                {
                                    playerId: player.id,
                                    text: whisperMatch[2],
                                    type: CHAT_TYPE.WHISPER,
                                } as IChatSendArgs);
                        } else {
                            // show in chat
                            this.context.eventQueue.pub(Events.CHAT_RECEIVED,
                                {
                                    chatMessage: "ERROR: Unknown player",
                                    chatType: CHAT_TYPE.WHISPER,
                                    playerId: this.context.state.id,
                                } as IChatArgs);
                        }
                    }
                } else {
                    this.context.connection.sendCommand(command, args);
                }
            }
            this.hide();
        }
    }
}
