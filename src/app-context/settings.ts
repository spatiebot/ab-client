export class Settings {
    public websocketUrl: string = "wss://game.airmash.cc/ffa";
    public playerName: string = "Unknown";
    public horizonX: number = 2000;
    public horizonY: number = 2000;
    public flag: string = "jolly";
    public logLevel: string = "info";
    public isDevelopment: boolean = false;
    public zoom = 0.8;
    public useBitmaps: boolean = true;
    public shouldShowDebugInfo: boolean = false;
}


/*
data: "[{"name":"Europe","id":"eu","games":[{"type":"1","id":"ffa1","name":"Free For All #1","nameShort":"FFA #1","host":"eu.airmash.online","path":"ffa","players":8,"bots":5},{"type":"2","id":"ctf1","name":"Capture The Flag #1","nameShort":"CTF #1","host":"dev.airbattle.xyz","path":"ctf","players":12,"bots":12},{"type":"3","id":"btr1","name":"Battle Royale #1","nameShort":"BTR #1","host":"eu.airmash.online","path":"btr","players":1}]},{"name":"US","id":"us","games":[{"type":"1","id":"ffa1","name":"Free For All #1","nameShort":"FFA #1","host":"game.airmash.cc","path":"ffa","players":0},{"type":"1","id":"ffa2","name":"Free For All #2","nameShort":"FFA #2","host":"ffa.herrmash.com","path":"ffa","players":13,"bots":5},{"type":"2","id":"ctf1","name":"Capture The Flag #1","nameShort":"CTF #1","host":"game.airmash.cc","path":"ctf","players":0},{"type":"2","id":"ctf2","name":"Capture The Flag #2","nameShort":"CTF #2","host":"ctf.herrmash.com","path":"ctf","players":12,"bots":12},{"type":"3","id":"btr1","name":"Battle Royale #1","nameShort":"BTR #1","host":"us.airmash.online","path":"btr","players":0}]}]"
*/