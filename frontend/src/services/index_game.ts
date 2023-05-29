import { Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import authenticationService from "../services/authentication-service"
import { useRouter } from "next/router";
import userService from "./user-service";

type DefaultEventsMap = /*unresolved*/ any;
class GameService {

    public async joinGameRoom(socket : Socket<DefaultEventsMap, DefaultEventsMap> | null, roomId: string, mode: string, id : number, username: string): Promise<boolean>
    {

        const payload = {message: roomId, userid: id, username: username}
        return new Promise((rs, rj) => {
            if (mode == "Classic")
            {
                socket?.emit("join_game", payload ); // ici on lance la game envoie un socket au back sauf que la socket n'est pas recu par le back et quand on l'envoie pas ca crash car elle existe pas
            }
            else if (mode == "Extra")
            {
                socket?.emit("join_game_extra", payload ); // ici on lance la game envoie un socket au back sauf que la socket n'est pas recu par le back et quand on l'envoie pas ca crash car elle existe pas
            }

            socket?.on("start_game", () => {
                window.location.href = "/pong";
              });
            socket?.on("start_game_extra", () => {
                window.location.href = "/pong_extra";
              });
            socket?.on("room_joined", () => 
            {
            });
            socket?.on("room_join_error",({ error } : {error : string}) => rj(error))
        });
    }
}

const gameService = new GameService();

export default gameService;
