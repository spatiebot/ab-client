import { decodeKeystate, decodeUpgrades } from "../ab-protocol/src/lib";
import { PlayerMovements } from "../models/player-movements";
import { PowerUps } from "../models/power-ups";

export class Decoder {

    public static upgradesToPowerUps(upgrades: number): PowerUps {
        if (!upgrades) {
            return null;
        }

        return decodeUpgrades(upgrades);
    }

    public static keystateToPlayerMovements(keystate: number): PlayerMovements {
        if (!keystate) {
            return null;
        }

        return decodeKeystate(keystate);
    }
}
