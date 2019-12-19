import axios from "axios";
import { ServerRegionInfoDto } from "../models/server-region-info";

const GAMES_URL = "https://data.airmash.online/games?main=1&_=";

export class ServerGamesRepository {

    public async getServerInfo(): Promise<ServerRegionInfoDto> {
        const response = await axios.get(GAMES_URL + Date.now);
        const data = response.data;

        // the data property in the response is again stringified
        data.data = JSON.parse(data.data);

        return data;
    }
}
