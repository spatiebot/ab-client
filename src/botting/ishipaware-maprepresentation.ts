import { IPos } from "../models/ipos";

export interface IShipAwareMapRepresentation {
    findPath(pos1: IPos, pos2: IPos): IPos[];
    getScale(): number;
}