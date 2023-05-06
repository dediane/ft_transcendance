import { Socket } from "socket.io-client";
import { useRef } from "react";

class GameService {

    public async joinGameRoom(socket: Socket, roomId: string ): Promise<boolean>
    {
        console.log("ldefnjk, socket -> ", socket.id);
        console.log("ldefnjk, room id -> ", roomId);
        console.log("before emit");
        return new Promise((rs, rj) => {
            // socket.emit("join_game", {message: roomId} ); // ici on lance la game envoie un socket au back sauf que la socket n'est pas recu par le back et quand on l'envoie pas ca crash car elle existe pas
            socket.emit("join_game", roomId ); // ici on lance la game envoie un socket au back sauf que la socket n'est pas recu par le back et quand on l'envoie pas ca crash car elle existe pas
            socket.on("room_joined", () => rs(true))
            socket.on("room_join_error", ({error}) => rj(error))
            console.log("after emit");
        });
    }
}
export default new GameService();
