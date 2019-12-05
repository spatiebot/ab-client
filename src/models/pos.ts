export class Pos {

    x: number;
    y: number;

    constructor(x?: number | { x: number, y: number }, y?: number) {
        if ((x || x === 0) && (y || y === 0)) {
            this.x = x as number;
            this.y = y;
        } else if (x) {
            const other = x as Pos;
            this.x = other.x;
            this.y = other.y;
        }
    }
}