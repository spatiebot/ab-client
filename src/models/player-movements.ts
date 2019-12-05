import { Keystate } from "../ab-protocol/src/types/client";

export class PlayerMovements {
    public keystate: Keystate;
    public boost: boolean;
    public strafe: boolean;
    public stealthed: boolean;
    public flagspeed: boolean;
  }
