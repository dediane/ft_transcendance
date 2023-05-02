import { Socket } from "socket.io-client";

class GameService {

    public async joinGameRoom(socket: Socket, ): Promise<boolean>
    {
        console.log("before emit");
        return new Promise((rs, rj) => {
            socket.emit("join_game", {  }); // ici on lance la game envoie un socket au back
            socket.on("room_joined", () => rs(true))
            socket.on("room_error", ({error}) => rj(error))
            console.log("after emit");

        });
    }
}
export default new GameService();
