import { IContext } from "../app-context/icontext";
import { Pos } from "../models/pos";

export class ClippedView {

    private clipRectangle: Pos[];

    constructor(private context: IContext) {
    }

    public setClip(canvas: HTMLCanvasElement): void {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const myPos = this.context.state.getMe().pos;
        const halfWidth = canvas.width / 2;
        const halfHeight = canvas.height / 2;
        this.clipRectangle = [
            new Pos(myPos.x - halfWidth, myPos.y - halfHeight),
            new Pos(myPos.x + halfWidth, halfHeight),
        ];
    }

    public isVisible(pos: Pos): boolean {
        return this.clipRectangle[0].x < pos.x && this.clipRectangle[1].x > pos.x &&
            this.clipRectangle[0].y < pos.y && this.clipRectangle[1].y > pos.y;
    }

    public translate(pos: Pos): Pos {
        return new Pos(pos.x - this.clipRectangle[0].x, pos.y - this.clipRectangle[0].y);
    }
}
