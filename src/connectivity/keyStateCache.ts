import { KEY_CODES } from "../ab-protocol/src/lib";
import { StopWatch } from "../helpers/stopwatch";

export class KeyStateCache {
    public key: KEY_CODES;
    public state: boolean;
    public lastPressed: StopWatch;

    constructor(key: KEY_CODES, state: boolean) {
        this.key = key;
        this.state = state;
        this.lastPressed = new StopWatch();
    }
}
