import { MOB_TYPES } from "../../ab-protocol/src/lib";
import { Pos } from "../../models/pos";

export interface IExplosionArgs {
    type: MOB_TYPES;
    pos: Pos;
}
