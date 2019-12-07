import { MOB_TYPES } from "../ab-protocol/src/lib";
import { Pos } from "./pos";

export class Mob {
    public id: number;

    public pos: Pos;
    public mobType: MOB_TYPES;
    public rot: number;
    public speed: Pos;
    public maxSpeed: number;
    public accel: Pos;
    public ownerId: number;
    public isVisibleOnScreen: boolean;
    public distance: number;
}
