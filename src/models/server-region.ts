import { GameEndpoint } from "./game-endpoint";

export class ServerRegion {
    public name: string;
    public id: string;
    public games: GameEndpoint[];
}
