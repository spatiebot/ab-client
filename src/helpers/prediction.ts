import { IPos } from "../models/ipos";

const MS_PER_SEC = 1000;
const FPS = 60;
const MS_PER_FRAME = MS_PER_SEC / FPS;

export class Prediction {
    static predictPosition(pos: IPos, speed: IPos, lookaheadMs: number): IPos {
        if (!speed || !pos) {
            return pos;
        }

        const framesAhead = lookaheadMs / MS_PER_FRAME;

        const pred: IPos = {
            x: pos.x + speed.x * framesAhead,
            y: pos.y + speed.y * framesAhead
        };

        return pred;
    }

}