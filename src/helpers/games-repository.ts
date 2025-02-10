import axios from "axios";
import { GameEndpoint } from "../models/game-endpoint";
import { ServerRegion } from "../models/server-region";
import { ServerRegionInfoDto } from "../models/server-region-info";

const GAMES_URL = "https://data.airmash.rocks/games?main=1&_=";
const FALLBACK_URL = "https://raw.githubusercontent.com/airmash-refugees/airmash-games/master/games.txt?_=";
const LOCAL_SERVER_URL = process.env.LOCAL_SERVER_URL; 

export class ServerGamesRepository {

    private addLocalServerUrl(serverInfo: ServerRegionInfoDto) {

        // if running locally, add the local server url to connect to
        if (!LOCAL_SERVER_URL) {
            return;
        } 

        const localUrl = new URL(LOCAL_SERVER_URL);

        serverInfo.data.unshift({
            games: [{
                host: localUrl.host,
                id: "local",
                name: "Local",
                nameShort: "local",
                path: localUrl.pathname.slice(1), // this doesn't matter if running locally
                players: 0,
                type: localUrl.protocol === "ws:" ? 0 : 1, // this probably doesnt matter too, use it as an http indicator
            } as GameEndpoint],
            id: "local",
            name: "Local",
        } as ServerRegion);
    }

    public async getServerInfo(): Promise<ServerRegionInfoDto> {

        let result: ServerRegionInfoDto;

        try {
            const response = await axios.get(GAMES_URL + Date.now());
            const data = response.data;

            // the data property in the response is again stringified
            data.data = JSON.parse(data.data);
            result = data;

        } catch (error) {

            result = await this.getFallbackData();

        }

        this.addLocalServerUrl(result);

        return result;
    }

    private async getFallbackData(): Promise<ServerRegionInfoDto> {
        // fallback data
        const response = await axios.get(FALLBACK_URL + Date.now());
        const data: string = response.data;
        const lines = data.split("\n");

        const result = new ServerRegionInfoDto();
        result.country = "?";
        result.protocol = 1;
        result.data = [];
        for (const line of lines) {
            const fields = line.split("|");
            let region = result.data.find((x) => x.name === fields[0]);
            if (!region) {
                region = new ServerRegion();
                region.name = fields[0];
                region.id = fields[0];
                region.games = [];
                result.data.push(region);
            }

            const game = new GameEndpoint();
            game.name = fields[3];
            game.nameShort = fields[4];
            game.host = fields[5];
            game.path = fields[6];

            region.games.push(game);
        }

        return result;
    }
}
