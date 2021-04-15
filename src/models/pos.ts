import { IPos } from "./ipos";

const PI_2 = Math.PI * 2;

export class Pos implements IPos {
    // TODO rename to Vector

    public x: number;
    public y: number;
    public length: number;

    constructor(x?: number | { x: number, y: number }, y?: number) {
        if ((x || x === 0) && (y || y === 0)) {
            this.x = x as number;
            this.y = y;
        } else if (x) {
            const other = x as Pos;
            this.x = other.x;
            this.y = other.y;
        } else {
            this.x = 0;
            this.y = 0;
        }
    }

    public direction() {
        let dir = -(Math.atan2(this.x, this.y) + Math.PI);
        if (dir < 0) {
            dir += PI_2;
        }
        if (dir > PI_2) {
            dir -= PI_2;
        }
        return dir;
    }

    public equals(other: IPos): boolean {
        return !!other && other.x === this.x && other.y === this.y;
    }
}
