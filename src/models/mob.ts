import { Pos } from "./pos";
import { MOB_TYPES } from "../ab-protocol/src/lib";

export class Mob {
    id: number;

    pos: Pos;
    mobType: MOB_TYPES;
    rot: number;
    speed: Pos;
    maxSpeed: number;
    accel: Pos;
    ownerId: number;
    isVisibleOnScreen: boolean;
}