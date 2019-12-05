import { BrowserContext } from "./browser-impl/browser-context";
import { Connection } from "./connectivity/connection";

class App {

    public async run() {
        const context = new BrowserContext();
        context.logger.info("Initializing app");

        context.processor.startProcessingEventQueue();

        const connection = new Connection(context);
        await connection.init();
        context.logger.info("Initialization finished");
    }
}

const app = new App();
app.run();
