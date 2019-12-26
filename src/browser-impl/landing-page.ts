
import { COUNTRY_NAMES, GAME_TYPES } from "../ab-protocol/src/lib";
import { ServerGamesRepository } from "../helpers/games-repository";
import { BrowserContext } from "./browser-context";

export class LandingPage {

    private serverGamesRepository: ServerGamesRepository;

    constructor(private context: BrowserContext) {
        this.serverGamesRepository = new ServerGamesRepository();
    }

    public async run(): Promise<void> {
        this.doBackground();

        const startButton = document.getElementById("start") as HTMLButtonElement;
        const gameSelect = document.getElementById("gameSelect") as HTMLSelectElement;

        startButton.onclick = () => {
            const name = document.getElementById("playerName") as HTMLInputElement;
            const styleSelect = document.getElementById("styleSelect") as HTMLSelectElement;
            const zoomSelect = document.getElementById("zoomSelect") as HTMLSelectElement;

            this.context.settings.playerName = name.value || "Unknown";
            this.context.settings.websocketUrl = gameSelect.selectedOptions[0].value;
            this.context.settings.zoom = Number(zoomSelect.value) || 1;
            this.context.settings.useBitmaps = styleSelect.value !== "2";

            document.getElementById("nameAndGame").style.display = "none";

            document.getElementById("chat").style.display = "block";
            document.getElementById("chat-input").style.display = "block";
            document.getElementById("aircraftSelection").style.display = "block";
            document.getElementById("stats").style.display = "block";
            document.getElementById("upgradeSelection").style.display = "block";
            document.getElementById("minimap").style.display = "block";
            document.getElementById("player-list").style.display = "block";
            // ctf-block will be shown later

            window.document.body.style.backgroundImage = "inherit";

            this.context.start();
        };

        await this.populateServerList(gameSelect);

        this.loadAllFlags();
    }

    private async populateServerList(gameSelect: HTMLSelectElement) {
        const serverInfo = await this.serverGamesRepository.getServerInfo();
        this.context.settings.flag = serverInfo.country;

        for (const server of serverInfo.data) {
            for (const game of server.games) {
                const opt = new Option();
                opt.value = "wss://" + game.host + "/" + game.path;
                opt.innerText = server.name + " - " + game.name;
                gameSelect.options.add(opt);
            }
        }
    }

    private loadAllFlags() {
        for (const flag of Object.keys(COUNTRY_NAMES)) {
            const img = document.createElement("img");
            img.src = `flags/${flag}.png`;
            img.style.display = "none";
            img.id = `flag-${flag}`;
            document.body.appendChild(img);
        }
    }

    private doBackground() {
        const map = document.getElementById("map") as HTMLImageElement;
        window.document.body.style.backgroundImage = `url(${map.src})`;
        window.document.body.style.backgroundSize = "cover";
    }
}
