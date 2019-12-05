import { Connection } from "./connectivity/connection";
import { NodeContext } from "./node-impl/node-context";

class App {

    public async run() {
        const context = new NodeContext();
        context.logger.info("Initializing app");

        context.processor.startProcessingEventQueue();

        const connection = new Connection(context);
        await connection.init();
        context.logger.info("Initialization finished");
    }
}

const app = new App();
app.run();
