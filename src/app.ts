import { performance } from "perf_hooks";
import { StopWatch } from "./helpers/stopwatch";
import { NodeContext } from "./node-impl/node-context";
import { argv } from "yargs";

class App {
    public async run() {
        const context = new NodeContext();

        const args = argv as any;
        if (args.url) {
            context.settings.websocketUrl = args.url as string;
        }
        if (args.name) {
            context.settings.playerName = args.name as string;
        }

        await context.start();
    }
}

StopWatch.performanceNow = () => performance.now();

const app = new App();
app.run();
