import { IPos } from "../models/ipos";

export interface IFindPathConfig {
    pos1: IPos;
    pos2: IPos;
    aircraftType: number;
    pointsToAvoid: IPos[];
}