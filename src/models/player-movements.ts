import { Keystate } from "../ab-protocol/src/types/client";

export class PlayerMovements {
    keystate: Keystate;
    boost: boolean;
    strafe: boolean;
    stealthed: boolean;
    flagspeed: boolean;
  };