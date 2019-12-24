import { Keystate, MOB_TYPES, PLAYER_STATUS } from "../ab-protocol/src/lib";
import { StopWatch } from "../helpers/stopwatch";
import { Mob } from "./mob";
import { PlayerMovements } from "./player-movements";
import { Pos } from "./pos";
import { PowerUps } from "./power-ups";
import { Upgrades } from "./upgrades";

const STALENESS_MS = 4000;

export class Player extends Mob {
    public id: number;
    public flag: number;
    public name: string;
    public type: number;
    public team: number;

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
    public shieldOrInfernoDuration: number;

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

    public get posFromMinimap(): Pos {
        return this.lowResPos;
    }
    public set posFromMinimap(value: Pos) {
        this.lowResPos = value;
        this.lowResPosUpdateTimer.start();
    }

    private lowResPos: Pos;
    private lowResPosUpdateTimer = new StopWatch();

    constructor() {
        super();
        this.mobType = MOB_TYPES.PLAYER;
        this.upgrades = new Upgrades();
        this.powerUps = new PowerUps();
        this.keystate = {} as Keystate;
    }

    public get mostReliablePos(): Pos {
        const diff = this.posUpdateTimer.elapsedMs - this.lowResPosUpdateTimer.elapsedMs;
        if (diff < STALENESS_MS || !this.lowResPos) {
            return this.pos;
        }
        return this.lowResPos;
    }

    public setMovements(movements: PlayerMovements) {
        if (movements) {
            this.boost = movements.boost;
            this.flagspeed = movements.flagspeed;
            this.stealthed = movements.stealthed;
            this.strafe = movements.strafe;
            this.keystate = movements.keystate;
        } else {
            this.boost = false;
            this.flagspeed = false;
            this.stealthed = false;
            this.strafe = false;
            this.keystate = {} as Keystate;
        }
    }

}
