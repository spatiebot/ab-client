import { ScoreDetailedScore, ScoreDetailedCtfScore } from "../../ab-protocol/src/types/packets-server";

export class ScoreDetailedArgs {
    ffaScores: ScoreDetailedScore[];
    ctfScores: ScoreDetailedCtfScore[];
}