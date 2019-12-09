import { CHAT_TYPE } from "../../ab-assets/chat-constants";

export interface IChatSendArgs {
    text: string;
    type: CHAT_TYPE;
    playerId: number;
}
