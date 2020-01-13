import { performance } from "perf_hooks";
import { StopWatch } from "./helpers/stopwatch";
import { NodeContext } from "./node-impl/node-context";

class App {
    public async run() {
        const context = new NodeContext();
        await context.start();
    }
}

StopWatch.performanceNow = () => performance.now();

const app = new App();
app.run();
