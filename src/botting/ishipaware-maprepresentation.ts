import { IPos } from "../models/ipos";

export interface IShipAwareMapRepresentation {
    findPath(pos1: IPos, pos2: IPos, pointsToAvoid: IPos[]): IPos[];
    getScale(): number;
}