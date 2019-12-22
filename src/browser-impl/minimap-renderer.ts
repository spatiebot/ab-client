import { MAP_SIZE, PLAYER_STATUS } from "../ab-protocol/src/lib";
import { IContext } from "../app-context/icontext";
import { Pos } from "../models/pos";

const MARKER_SIZE = 3;
const MY_RECT_WIDTH = 20;
const MY_RECT_HEIGHT = 10;

export class MinimapRenderer {

    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;

    constructor(private context: IContext) {
        this.canvas = document.getElementById("minimap-canvas") as HTMLCanvasElement;
        this.canvasContext = this.canvas.getContext("2d");
    }

    public render(): void {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const scaleX = this.canvas.width / MAP_SIZE.WIDTH;
        const scaleY = this.canvas.height / MAP_SIZE.HEIGHT;
        const halfMapX = MAP_SIZE.WIDTH / 2;
        const halfMapY = MAP_SIZE.HEIGHT / 2;

        const myId = this.context.state.id;

        for (const player of this.context.state.getPlayers()) {
            if (player.status === PLAYER_STATUS.INACTIVE) {
                continue;
            }

            const pos = new Pos(
                (player.mostReliablePos.x + halfMapX) * scaleX,
                (player.mostReliablePos.y + halfMapY) * scaleY);

            if (player.id === myId) {
                this.canvasContext.strokeStyle = "white";
                this.canvasContext.strokeRect(
                    pos.x - MY_RECT_WIDTH / 2, pos.y - MY_RECT_HEIGHT / 2,
                    MY_RECT_WIDTH, MY_RECT_HEIGHT);
            } else {
                let fillStyle = "darkred";
                switch (player.ranking) {
                    case 1:
                        fillStyle = "gold";
                        break;
                    case 2:
                        fillStyle = "silver";
                        break;
                    case 3:
                        fillStyle = "bronze";
                        break;
                }

                this.canvasContext.fillStyle = fillStyle;
                this.canvasContext.beginPath();
                this.canvasContext.arc(pos.x, pos.y, MARKER_SIZE, 0, 2 * Math.PI);
                this.canvasContext.fill();
            }
        }
    }

}
