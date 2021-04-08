import { IPos } from "../models/ipos";

export class BotState {
    playerToKill: number;
    turningTimeout: any;
    path: IPos[];
    autoPilotToFlag: boolean;

    stop() {
        this.path = null;
        this.playerToKill = null;
        this.autoPilotToFlag = false;
    }

}