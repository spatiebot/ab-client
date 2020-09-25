import { KEY_CODES } from "../ab-protocol/src/lib";
import { BrowserContext } from "../browser-impl/browser-context";

// this can't be a messagehandler, because the tick won't fire if browser is not visible
export class BrowserVisibilityHandler {

    constructor(private context: BrowserContext) {
    }

    public clearKeys(): void {
        const me = this.context.readState.getFocusedPlayer();
        if (!me) {
            return;
        }

        // send key-up for all keys
        if (me.keystate.DOWN) {
            this.context.connection.sendKey(KEY_CODES.DOWN, false);
        }
        if (me.keystate.UP) {
            this.context.connection.sendKey(KEY_CODES.UP, false);
        }
        if (me.keystate.LEFT) {
            this.context.connection.sendKey(KEY_CODES.LEFT, false);
        }
        if (me.keystate.RIGHT) {

            this.context.connection.sendKey(KEY_CODES.RIGHT, false);
        }

        this.context.connection.sendKey(KEY_CODES.SPECIAL, false);
        this.context.connection.sendKey(KEY_CODES.FIRE, false);
    }
}
