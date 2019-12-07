export class Pos { // TODO rename to Vector

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
}
