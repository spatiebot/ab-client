import { Connection } from "./connectivity/connection";
import { NodeContext } from "./node-impl/node-context";

class App {

    public async run() {
        const context = new NodeContext();
        await context.start();
    }
}

const app = new App();
app.run();
