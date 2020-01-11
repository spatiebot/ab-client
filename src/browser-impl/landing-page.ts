
import Cookies from "js-cookie";
import { COUNTRY_NAMES } from "../ab-protocol/src/lib";
import { Settings } from "../app-context/settings";
import { ServerGamesRepository } from "../helpers/games-repository";
import { StylesRepository } from "../helpers/styles-repository";
import { BrowserContext } from "./browser-context";

export class LandingPage {

    private serverGamesRepository: ServerGamesRepository;
    private stylesRepository: StylesRepository;
    private nameInput: HTMLInputElement;
    private styleSelect: HTMLSelectElement;
    private zoomSelect: HTMLSelectElement;
    private loadConstantsPromise: Promise<any>;

    constructor(private context: BrowserContext) {
        this.serverGamesRepository = new ServerGamesRepository();
        this.stylesRepository = new StylesRepository();

        this.nameInput = document.getElementById("playerName") as HTMLInputElement;
        this.styleSelect = document.getElementById("styleSelect") as HTMLSelectElement;
        this.zoomSelect = document.getElementById("zoomSelect") as HTMLSelectElement;
    }

    public async run(): Promise<void> {
        this.doBackground();

        await this.populateServerList();

        this.loadAllFlags();
        this.fillInPrevSettings();

        this.loadConstantsPromise = this.stylesRepository.loadStyle("styles/default/");

        this.styleSelect.addEventListener("change", () => {
            if (this.styleSelect.value !== "no-bitmaps") {
                this.loadConstantsPromise = this.stylesRepository.loadStyle(this.styleSelect.value);
            }
        });
    }

    private fillInPrevSettings() {
        const prevSettingsString = Cookies.get("settings");
        if (!prevSettingsString) {
            return;
        }

        const prevSettings = JSON.parse(prevSettingsString) as Settings;

        this.nameInput.value = prevSettings.playerName;
        this.select(this.zoomSelect, prevSettings.zoom.toString());

        if (!prevSettings.useBitmaps) {
            this.styleSelect.options[1].selected = true;
        }
    }

    private select(selectElement: HTMLSelectElement, value: string) {
        for (const option of selectElement.options) {
            if (option.value === value) {
                option.selected = true;
                break;
            }
        }
    }

    private async startGame(websocketUrl: string) {

        this.context.settings.playerName = this.nameInput.value || "Unknown";
        this.context.settings.websocketUrl = websocketUrl;
        this.context.settings.zoom = Number(this.zoomSelect.value) || 1;
        this.context.settings.useBitmaps = this.styleSelect.value !== "no-bitmaps";
        this.context.settings.horizonX = window.innerWidth / 2;
        this.context.settings.horizonY = window.innerHeight / 2;

        Cookies.set("settings", JSON.stringify(this.context.settings), { expires: 365 });

        document.getElementById("nameAndGame").style.display = "none";
        document.getElementById("chat").style.display = "block";
        document.getElementById("chat-input").style.display = "block";
        document.getElementById("aircraftSelection").style.display = "block";
        document.getElementById("stats").style.display = "block";
        document.getElementById("upgradeSelection").style.display = "block";
        document.getElementById("minimap").style.display = "block";
        document.getElementById("player-list").style.display = "block";
        document.getElementById("server-message").style.display = "block";

        await this.loadConstantsPromise;

        // ctf-block will be shown later
        window.document.body.style.backgroundImage = "inherit";
        this.context.start();
    }

    private async populateServerList() {
        const serverInfo = await this.serverGamesRepository.getServerInfo();

        const flag = Cookies.get("flag") || serverInfo.country;
        this.context.settings.flag = flag;

        const gamesContainer = document.getElementById("games");
        const table = document.createElement("table");
        table.innerHTML = "<tr><th>Region</th><th>Game</th><th>Players online</th><th></th></tr>";
        gamesContainer.append(table);

        for (const server of serverInfo.data) {
            for (const game of server.games) {
                const row = document.createElement("tr");
                table.append(row);

                const cellRegion = document.createElement("td");
                row.append(cellRegion);
                cellRegion.innerText = server.name;
                cellRegion.className = "region";

                const cellGameName = document.createElement("td");
                row.append(cellGameName);
                cellGameName.innerText = game.name;
                cellGameName.className = "game-name";

                const cellNumPlayers = document.createElement("td");
                row.append(cellNumPlayers);
                cellNumPlayers.innerText = game.players || game.players === 0 ? game.players.toString() : "?";
                cellNumPlayers.className = "num-players";

                const cellButton = document.createElement("td");
                row.append(cellButton);
                const button = document.createElement("input") as HTMLInputElement;
                cellButton.append(button);
                cellButton.className = "start-button";
                button.type = "button";
                button.value = "Start";

                const url = "wss://" + game.host + "/" + game.path;
                button.onclick = () => this.startGame(url);
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
