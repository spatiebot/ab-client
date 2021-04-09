import { KEY_CODES } from "../ab-protocol/src/lib";
import { IPos } from "../models/ipos";
import { IKeyInstruction } from "./key-instruction";

export class BotState {
    playerToKill: number;
    turningTimeout: any;
    path: IPos[];
    autoPilotToFlag: boolean;

    private keyQueue: IKeyInstruction[] = [];

    stop() {
        this.path = null;
        this.playerToKill = null;
        this.autoPilotToFlag = false;
    }

    enqueueKey(key: KEY_CODES, state: boolean, duration = 0) {
        this.keyQueue.push({ key, state, duration });
    }

    eatKeyQueue(): IKeyInstruction[] {
        const result = this.keyQueue;
        this.keyQueue = [];
        return result;
    }

}