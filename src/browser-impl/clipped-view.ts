import { IContext } from "../app-context/icontext";
import { Pos } from "../models/pos";

const SHAKE_MARGIN = 20;
const SHAKE_MARGIN_CSS = `-${SHAKE_MARGIN}px`;
const SHAKE_MARGIN_DOUBLE = SHAKE_MARGIN * 2;

export class ClippedView {

    private clipRectangle: Pos[];
    private lastWidth: number;
    private lastHeight: number;
    private zoom: number;

    constructor(private context: IContext) {
    }

    public setClip(canvas: HTMLCanvasElement): void {

        // add margin of 25 on each side to allow for shaking
        canvas.width = window.innerWidth + SHAKE_MARGIN_DOUBLE;
        canvas.height = window.innerHeight + SHAKE_MARGIN_DOUBLE;
        canvas.style.left = SHAKE_MARGIN_CSS;
        canvas.style.top = SHAKE_MARGIN_CSS;

        const zoom = this.context.settings.zoom;

        if (this.lastWidth !== canvas.width || this.lastHeight !== canvas.height) {
            const screenSizeX = canvas.width / zoom;
            const screenSizeY = canvas.height / zoom;
            this.context.connection.sendScreenSize(screenSizeX, screenSizeY);
            this.lastWidth = canvas.width;
            this.lastHeight = canvas.height;

            // this is for sending the correct initial values
            this.context.settings.horizonX = screenSizeX / 2;
            this.context.settings.horizonY = screenSizeY / 2;
        }

        const myPos = this.context.state.getMe().pos;
        const halfWidth = (canvas.width / zoom) / 2;
        const halfHeight = (canvas.height / zoom) / 2;
        this.clipRectangle = [
            new Pos(myPos.x - halfWidth, myPos.y - halfHeight),
            new Pos(myPos.x + halfWidth, myPos.y + halfHeight),
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

    public scale(x: number) {
        return x * this.zoom;
    }

    public getClipRectangle(): Pos[] {
        // make a copy to prevent altering
        return [
            new Pos(this.clipRectangle[0]),
            new Pos(this.clipRectangle[1]),
        ];
    }

    public getClipSize(): Pos {
        return new Pos(this.lastWidth, this.lastHeight);
    }
}
