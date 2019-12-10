import { IContext } from "../app-context/icontext";
import { Pos } from "../models/pos";

export class ClippedView {

    public zoom: number;

    private clipRectangle: Pos[];
    private lastWidth: number;
    private lastHeight: number;

    constructor(private context: IContext) {
    }

    public setClip(canvas: HTMLCanvasElement): void {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const zoom = this.context.settings.zoom;

        if (this.lastWidth !== canvas.width || this.lastHeight !== canvas.height) {
            this.context.connection.sendScreenSize(canvas.width / zoom, canvas.height / zoom);
            this.lastWidth = canvas.width;
            this.lastHeight = canvas.height;
        }

        const myPos = this.context.state.getMe().pos;
        const halfWidth = (canvas.width / zoom) / 2;
        const halfHeight = (canvas.height / zoom) / 2;
        this.clipRectangle = [
            new Pos(myPos.x - halfWidth, myPos.y - halfHeight),
            new Pos(myPos.x + halfWidth, halfHeight),
        ];

        this.zoom = zoom;
    }

    public isVisible(pos: Pos): boolean {
        return this.clipRectangle[0].x < pos.x && this.clipRectangle[1].x > pos.x &&
            this.clipRectangle[0].y < pos.y && this.clipRectangle[1].y > pos.y;
    }

    public translate(pos: Pos): Pos {
        return new Pos((pos.x - this.clipRectangle[0].x) * this.zoom, (pos.y - this.clipRectangle[0].y) * this.zoom);
    }
}
