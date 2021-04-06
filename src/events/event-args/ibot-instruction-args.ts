import { KEY_CODES } from "../../ab-protocol/src/lib";

export interface IBotInstructionArgs {
    keyToSend: KEY_CODES;
    keyState: boolean;
}