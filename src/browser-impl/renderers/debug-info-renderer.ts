import { IContext } from "../../app-context/icontext";

export class DebugInfoRenderer {
    private lagInMsElement: HTMLSpanElement;
    private skippedFramesElement: HTMLSpanElement;

    constructor(private context: IContext) {
        this.lagInMsElement = document.getElementById("lag-in-ms") as HTMLSpanElement;
        this.skippedFramesElement = document.getElementById("skipped-frames") as HTMLSpanElement;
    }

    public render(): void {
        if (!this.context.settings.shouldShowDebugInfo) {
            return;
        }

        const lag = this.context.connection.getLagMs();
        this.lagInMsElement.innerText = lag.toLocaleString("en-us", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        });

        this.skippedFramesElement.innerText = this.context.state.skippedFrames.toString();
    }
}
