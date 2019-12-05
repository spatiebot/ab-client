import { Context } from "./app-context/context";
import { Connection } from "./connectivity/connection";

class App {

    async run() {
        const context = new Context();
        context.logger.info("Initializing app");

        context.processor.startProcessingEventQueue();

        const connection = new Connection(context);
        await connection.init();
        context.logger.info("Initialization finished");
    }
}

const app = new App();
app.run();
