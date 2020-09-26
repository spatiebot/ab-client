import { Keystate, PLAYER_STATUS } from "../ab-protocol/src/lib";
import { StopWatch } from "../helpers/stopwatch";
import { Mob } from "./mob";
import { Pos } from "./pos";
import { PowerUps } from "./power-ups";
import { Upgrades } from "./upgrades";

export class Player extends Mob {
    public id: number;
    public flag: number;
    public name: string;
    public type: number;

    public energy: number = 1;
    public energyRegen: number;

    public flagspeed: boolean;
    public stealthed: boolean;
    public strafe: boolean;
    public boost: boolean;
    public keystate: Keystate;

    public upgrades: Upgrades;
    public powerUps: PowerUps;
    public hasShield: boolean;
    public hasInferno: boolean;
    public shieldOrInfernoTimer: StopWatch;

    public health: number = 1;
    public healthRegen: number;

    public score: number = 0;
    public level: number;
    public kills: number;
    public deaths: number;
    public damage: number;
    public ping: number;
    public captures: number;
    public ranking: number;

    public status: PLAYER_STATUS;
    public isMuted: boolean;

    public lowResPos: Pos;
    public lowResPosUpdateTimer: StopWatch;

}
