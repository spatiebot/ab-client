import { BrowserContext } from "./browser-impl/browser-context";
import { Connection } from "./connectivity/connection";

class App {

    public async run() {
        const context = new BrowserContext();
        await context.start();
    }
}

const app = new App();
app.run();
