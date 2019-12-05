import { Pos } from "../../models/pos";
import { MOB_TYPES } from "../../ab-protocol/src/lib";

export interface ExplosionArgs {
    type: MOB_TYPES,
    pos: Pos;
}