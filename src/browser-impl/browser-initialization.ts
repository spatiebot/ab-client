import { Events } from "../events/constants";
import { IBrowserVisibilityArgs } from "../events/event-args/browser-visibility-args";
import { StopWatch } from "../helpers/stopwatch";
import { BrowserContext } from "./browser-context";

/**
 * specific initializations needed for using the app in the browser
 */
export class BrowserInitialization {

    constructor(private context: BrowserContext) {

    }

    public detectVisibilityChange() {
        let hidden: string;
        let visibilityChange: string;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof (document as any).msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof (document as any).webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }

        const handleVisibilityChange = () => {
            const isVisible = !document[hidden];
            // this can't be published to the eventqueue, because the tick interval won't fire
            // if the browserwindow isn't visible (in most browsers).
            this.context.setBrowserVisibility(isVisible);
        };

        document.addEventListener(visibilityChange, handleVisibilityChange, false);

        // set initial value
        this.context.isBrowserVisible = !document[hidden];
    }

    public throttleZoom() {
        // throttle Ctrl+Scroll to prevent flooding
        const zoomThrottleStopwatch = new StopWatch();
        document.getElementById("root").addEventListener("wheel", (e) => {
            if (e.ctrlKey) {
                if (zoomThrottleStopwatch.elapsedSeconds < 1) {
                    e.preventDefault();
                    return;
                }
                zoomThrottleStopwatch.start();
            }
        });
    }
}
