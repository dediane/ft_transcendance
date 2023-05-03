import { Socket, io } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";


class SocketService {
    public socket: Socket | null = null;

    public connect(url: string): Promise<Socket<DefaultEventsMap, DefaultEventsMap>> {
        return new Promise((rs, rj) => {
            this.socket = io(url);
            if (!this.socket) return (rj());
            console.log("this socket exist ", this.socket.id);
            this.socket.on("connect", () => {
                rs(this.socket as Socket)
            })
            this.socket.on("connect_error", (err) => {
                console.log("Connection error: ", err);
                rj(err);
            })
        });
    }
}

export default new SocketService();