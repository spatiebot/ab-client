import { ScoreDetailedCtfScore, ScoreDetailedScore } from "../../ab-protocol/src/types/packets-server";

export class ScoreDetailedArgs {
    public ffaScores: ScoreDetailedScore[];
    public ctfScores: ScoreDetailedCtfScore[];
}
