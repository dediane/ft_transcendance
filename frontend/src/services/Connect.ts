import React from "react";
import { Socket } from "socket.io-client";
import AuthService from "../services/authentication-service"

type DefaultEventsMap = /*unresolved*/ any;
class ConnectService {

    public async Connect(socket : Socket<DefaultEventsMap, DefaultEventsMap> | null) {        
        if (!socket)
            return ;
        const payload = {userid: await AuthService.getId(), username: await AuthService.getUsername()}
        socket.emit("join_game chat", payload);
        
        socket.on("start_game chat", () => {
            window.location.href = "/pong_chat"; // ici a coder cette page
        });

        socket.on("room_joined chat", () => 
        {
        });
        socket.on("room_join_error chat",() => {
            alert("Error you canno't join")
        });
    }
}

const connectServiceInstance = new ConnectService();
export default connectServiceInstance;