import { IPos } from "../models/ipos";

export class BotState {
    playerToKill: number;
    turningTimeout: any;
    path: IPos[];
}