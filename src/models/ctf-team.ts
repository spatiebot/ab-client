import { Pos } from "./pos";
import { CTF_FLAG_STATE } from "../ab-protocol/src/lib";

export class CtfTeam {
    flagState: CTF_FLAG_STATE;
    flagTakenById: number;
    flagPos: Pos;
    score: number;
}