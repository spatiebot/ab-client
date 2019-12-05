export interface IWebSocketFactory {
    create(url: string): WebSocket;
}
