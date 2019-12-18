import { BrowserContext } from "./browser-impl/browser-context";
import { Connection } from "./connectivity/connection";

class App {

    public async run() {
        const context = new BrowserContext();
        await context.start();
    }
}

const w = window as any;
w.mapLoaded = (map: HTMLImageElement) => {
    // takes long, so we should wait for this.

    map.style.display = "none";

    const app = new App();
    app.run();

};
