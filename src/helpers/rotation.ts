import { IPos } from "../models/ipos";

export class Rotation {
    static getAngleDiff(current: number, target: number): number {
        return Math.atan2(Math.sin(target - current), Math.cos(target - current));
    }

    static getTargetRotation(pos1: IPos, pos2: IPos): number {
        let theta = Math.atan2(pos2.x - pos1.x, pos1.y - pos2.y);
        if (theta < 0) {
            theta += Math.PI * 2;
        }

        return theta;
    }
}