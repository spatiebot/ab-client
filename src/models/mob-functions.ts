import { Keystate, MOB_TYPES } from "../ab-protocol/src/lib";
import { PlayersRenderer } from "../browser-impl/renderers/players-renderer";
import { StopWatch } from "../helpers/stopwatch";
import { Mob } from "./mob";
import { Player } from "./player";
import { PlayerMovements } from "./player-movements";
import { Pos } from "./pos";
import { PowerUps } from "./power-ups";
import { Upgrades } from "./upgrades";

const STALENESS_MS = 4000;

export class MobFunctions {

    public static setPos(m: Mob, x: number, y: number) {
        if (m.highResPos) {
            m.highResPos.x = x;
            m.highResPos.y = y;
        }
        else {
            m.highResPos = new Pos(x, y);
        }

        m.posUpdateTimer = m.posUpdateTimer || new StopWatch();
        m.posUpdateTimer.start();
    }

    public static createMob(x: number = 0, y: number = 0): Mob {
        const mob = new Mob();
        mob.speed = new Pos();
        mob.accel = new Pos();
        MobFunctions.setPos(mob, x, y);
        return mob;
    }

    public static createPlayer(): Player {
        const player = new Player();
        player.speed = new Pos();
        player.accel = new Pos();
        MobFunctions.setPos(player, null, null);

        player.mobType = MOB_TYPES.PLAYER;
        player.upgrades = new Upgrades();
        player.powerUps = new PowerUps();
        player.keystate = {} as Keystate;

        return player;
    }

    public static setPosFromMinimap(p: Player, value: Pos) {
        p.lowResPos = value;
        p.lowResPosUpdateTimer = p.lowResPosUpdateTimer || new StopWatch();
        p.lowResPosUpdateTimer.start();
    }

    public static setMovements(p: Player, movements: PlayerMovements) {
        if (movements) {
            p.boost = movements.boost;
            p.flagspeed = movements.flagspeed;
            p.stealthed = movements.stealthed;
            p.strafe = movements.strafe;
            p.keystate = movements.keystate;
        } else {
            p.boost = false;
            p.flagspeed = false;
            p.stealthed = false;
            p.strafe = false;
            p.keystate = {} as Keystate;
        }
    }

    public static getMostReliablePos(p: Player): Pos {
        if (!p.posUpdateTimer || !p.lowResPosUpdateTimer) {
            return p.highResPos || p.lowResPos;
        }

        const diff = p.posUpdateTimer.elapsedMs - p.lowResPosUpdateTimer.elapsedMs;
        if (diff < STALENESS_MS || !p.lowResPos) {
            return p.highResPos;
        }
        return p.lowResPos;
    }

    public static restoreComplexPlayerObjects(player: Player) {
        // restore mob
        this.restoreComplexMobObjects(player);
        // restore  Player
        player.lowResPos = new Pos(player.lowResPos);
        player.lowResPosUpdateTimer = new StopWatch(player.lowResPosUpdateTimer);
        player.shieldOrInfernoTimer = new StopWatch(player.shieldOrInfernoTimer);
    }

    public static restoreComplexMobObjects(mob: Mob) {
        mob.highResPos = new Pos(mob.highResPos);
        mob.speed = new Pos(mob.speed);
        mob.accel = new Pos(mob.accel);
        mob.posUpdateTimer = new StopWatch(mob.posUpdateTimer);
    }

}
