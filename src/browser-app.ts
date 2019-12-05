import { Connection } from "./connectivity/connection";
import { BrowserContext } from "./browser-impl/browser-context";

class App {

    async run() {
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
