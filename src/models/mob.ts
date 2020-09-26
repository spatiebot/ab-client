import { MOB_TYPES } from "../ab-protocol/src/lib";
import { StopWatch } from "../helpers/stopwatch";
import { Pos } from "./pos";

export class Mob {

    public id: number;
    public mobType: MOB_TYPES;
    public rot: number;
    public maxSpeed: number;
    public ownerId: number;
    public team: number;
    public isVisibleOnScreen: boolean;
    public distance: number;

    public highResPos: Pos;
    public speed: Pos;
    public accel: Pos;

    public posUpdateTimer: StopWatch;
}
