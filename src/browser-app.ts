import { BrowserContext } from "./browser-impl/browser-context";
import { LandingPage } from "./browser-impl/landing-page";
import { StopWatch } from "./helpers/stopwatch";

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

const landingPage = new LandingPage(new BrowserContext());
landingPage.run();
