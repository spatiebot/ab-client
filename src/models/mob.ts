import { MOB_TYPES } from "../ab-protocol/src/lib";
import { StopWatch } from "../helpers/stopwatch";
import { Pos } from "./pos";

export class Mob {

    public id: number;
    public mobType: MOB_TYPES;
    public rot: number;
    public speed: Pos;
    public maxSpeed: number;
    public accel: Pos;
    public ownerId: number;
    public team: number;
    public isVisibleOnScreen: boolean;
    public distance: number;

    public get pos(): Pos {
        return this.highResPos;
    }
    public set pos(value: Pos) {
        this.highResPos = value;
        this.posUpdateTimer.start();
    }

    protected posUpdateTimer = new StopWatch();

    private highResPos: Pos;

    constructor() {
        this.speed = new Pos();
        this.pos = new Pos();
        this.accel = new Pos();
    }

}
