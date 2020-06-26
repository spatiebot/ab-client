import { IContext } from "../../app-context/icontext";

export class DebugInfoRenderer {
    private debugPanel: HTMLDivElement;
    private skippedFramesElement: HTMLSpanElement;

    constructor(private context: IContext) {
        this.debugPanel = document.getElementById("debugPanel") as HTMLDivElement;
    }

    public render(): void {
        if (!this.context.settings.shouldShowDebugInfo) {
            return;
        }

        const lag = this.context.connection.getLagMs();
        const lagText = lag.toLocaleString("en-us", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        });

        const skippedFramesText = this.context.state.skippedFrames.toString();

        this.debugPanel.innerHTML = `Lag: ${lagText}\nSkipped frames: ${skippedFramesText}\n` +
            `My id: ${this.context.state.id}\n` +
            `GameType: ${this.context.gameType}`;
    }
}
