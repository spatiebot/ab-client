import { CTF_FLAG_STATE } from "../ab-protocol/src/lib";
import { Pos } from "./pos";

export class CtfTeam {
    public flagState: CTF_FLAG_STATE;
    public flagTakenById: number;
    public flagPos: Pos;
    public score: number;
}
