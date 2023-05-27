import { Socket } from "socket.io-client";
import { useRef } from "react";
import AuthService from "../services/authentication-service"

class GameService {

    public async joinGameRoom(socket : React.MutableRefObject<undefined>, roomId: string, mode: string ): Promise<boolean>
    {
        const payload = {message: roomId, userid: AuthService.getId(), username: AuthService.getUsername()}
        return new Promise((rs, rj) => {
            if (mode == "Classic")
            {
                socket.current?.emit("join_game", payload ); // ici on lance la game envoie un socket au back sauf que la socket n'est pas recu par le back et quand on l'envoie pas ca crash car elle existe pas
            }
            else if (mode == "Extra")
            {
                socket.current?.emit("join_game_extra", payload ); // ici on lance la game envoie un socket au back sauf que la socket n'est pas recu par le back et quand on l'envoie pas ca crash car elle existe pas
            }

            socket.current?.on("start_game", () => {
                window.location.href = "/pong";
              });
            socket.current?.on("start_game_extra", () => {
                window.location.href = "/pong_extra";
              });
            socket.current?.on("room_joined", () => 
            {
            });
            socket.current?.on("room_join_error",({ error }) => rj(error))
        });
    }
}

const gameService = new GameService();

export default gameService;
