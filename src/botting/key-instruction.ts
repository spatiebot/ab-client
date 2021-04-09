import { KEY_CODES } from "../ab-protocol/src/lib";

export interface IKeyInstruction {
    key: KEY_CODES;
    state: boolean;
    duration: number;
}