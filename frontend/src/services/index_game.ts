import { Socket } from "socket.io-client";
import { useRef } from "react";
import AuthService from "../services/authentication-service"

class GameService {

    public async joinGameRoom(socket : React.MutableRefObject<undefined>, roomId: string ): Promise<boolean>
    {
        console.log("ldefnjk, room id -> ", roomId);
        console.log("before emit");
        const payload = {message: roomId, userid: AuthService.getId(), username: AuthService.getUsername()}
        return new Promise((rs, rj) => {
            // socket.emit("join_game", {message: roomId} ); // ici on lance la game envoie un socket au back sauf que la socket n'est pas recu par le back et quand on l'envoie pas ca crash car elle existe pas
            // socket.emit("join_game", roomId ); // ici on lance la game envoie un socket au back sauf que la socket n'est pas recu par le back et quand on l'envoie pas ca crash car elle existe pas
            socket.current?.emit("join_game", payload ); // ici on lance la game envoie un socket au back sauf que la socket n'est pas recu par le back et quand on l'envoie pas ca crash car elle existe pas
            socket.current?.on("start_game", () => {
                console.log("connected with 2 people");
                window.location.href = "/pong";
              });
            socket.current?.on("room_joined", () => 
            {
                console.log("has join " , AuthService.getId());
            });
            socket.current?.on("room_join_error",({ error }) => rj(error))
            console.log("after emit");
        });
    }
}
export default new GameService();
