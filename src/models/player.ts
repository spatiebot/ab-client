import { Keystate, MOB_TYPES, PLAYER_STATUS } from "../ab-protocol/src/lib";
import { Mob } from "./mob";
import { Pos } from "./pos";
import { PowerUps } from "./power-ups";
import { Upgrades } from "./upgrades";

export class Player extends Mob {

    public id: number;
    public flag: number;
    public name: string;
    public type: number;
    public team: number;

    public lowResPos: Pos;

    public energy: number;
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
    public shieldOrInfernoDuration: number;

    public health: number;
    public healthRegen: number;

    public score: number;
    public level: number;
    public kills: number;
    public deaths: number;
    public damage: number;
    public ping: number;
    public captures: number;

    public status: PLAYER_STATUS;
    public isMuted: boolean;

    constructor() {
        super();
        this.mobType = MOB_TYPES.PLAYER;
    }
}
