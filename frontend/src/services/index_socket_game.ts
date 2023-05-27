import { Socket, io } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";


class SocketService {
    public socket: Socket | null = null;

    public connect(url: string): Promise<any> {
        return new Promise((rs, rj) => {
            this.socket = io(url);
            if (!this.socket) return (rj());
            this.socket.on("connect", () => {
                rs(this.socket as Socket)
            })
            this.socket.on("connect_error", (err) => {
                rj(err);
            })
        });
    }
}

const socketService = new SocketService();

export default socketService;