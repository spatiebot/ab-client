import { performance } from "perf_hooks";
import { StopWatch } from "./helpers/stopwatch";
import { NodeContext } from "./node-impl/node-context";
import { argv } from "yargs";

class App {
    public async run() {
        const context = new NodeContext();

        if (argv.url) {
            context.settings.websocketUrl = argv.url as string;
        }
        if (argv.name) {
            context.settings.playerName = argv.name as string;
        }

        await context.start();
    }
}

StopWatch.performanceNow = () => performance.now();

const app = new App();
app.run();
