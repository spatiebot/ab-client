import { CHAT_TYPE } from "../../ab-assets/chat-constants";

export interface IChatArgs {
    playerId: number;
    to: number;
    chatType: CHAT_TYPE;
    chatMessage: string;
}
