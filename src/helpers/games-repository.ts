import axios from "axios";
import { GameEndpoint } from "../models/game-endpoint";
import { ServerRegion } from "../models/server-region";
import { ServerRegionInfoDto } from "../models/server-region-info";

const GAMES_URL = "https://data.airmash.online/games?main=1&_=";
const FALLBACK_URL = "https://raw.githubusercontent.com/airmash-refugees/airmash-games/master/games.txt?_=";

export class ServerGamesRepository {

    public async getServerInfo(): Promise<ServerRegionInfoDto> {
        try {
            const response = await axios.get(GAMES_URL + Date.now);
            const data = response.data;

            // the data property in the response is again stringified
            data.data = JSON.parse(data.data);

            return data;

        } catch (error) {
            // fallback data
            const response = await await axios.get(FALLBACK_URL + Date.now);
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
}
