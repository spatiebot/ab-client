import { IPos } from "../models/ipos";

export class Delta {
    public diffX: number;
    public diffY: number;
    public distance: number;

    public static getDelta(first: IPos, second: IPos): Delta {
        if (!first || !second) {
            return null;
        }

        const diffX = second.x - first.x;
        const diffY = second.y - first.y;
        const distance = Math.sqrt(diffX * diffX + diffY * diffY);
        return {
            diffX,
            diffY,
            distance
        };
    }
}