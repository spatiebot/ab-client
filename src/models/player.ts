import { PLAYER_STATUS, Keystate, MOB_TYPES } from "../ab-protocol/src/lib";
import { PowerUps } from "./power-ups";
import { Upgrades } from "./upgrades";
import { Mob } from "./mob";
import { Pos } from "./pos";

export class Player extends Mob {

    constructor() {
        super();
        this.mobType = MOB_TYPES.PLAYER;
    }

    id: number;
    flag: number;
    name: string;
    type: number;
    team: number;

    lowResPos: Pos;

    energy: number;
    energyRegen: number;

    flagspeed: boolean;
    stealthed: boolean;
    strafe: boolean;
    boost: boolean;
    keystate: Keystate;

    upgrades: Upgrades;
    powerUps: PowerUps;
    hasShield: boolean;
    hasInferno: boolean;
    shieldOrInfernoDuration: number;

    health: number;
    healthRegen: number;

    score: number;
    level: number;
    kills: number;
    deaths: number;
    damage: number;
    ping: number;
    captures: number;

    status: PLAYER_STATUS;
    isMuted: boolean;
}