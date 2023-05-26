import React from "react";
import { Socket } from "socket.io-client";
import AuthService from "../services/authentication-service"

class ConnectService {

    public async Connect(socket : React.MutableRefObject<undefined>) {        
        if (!socket)
            return ;
        const payload = {userid: await AuthService.getId(), username: await AuthService.getUsername()}
        console.log("in Connect user is  ", payload.userid, payload.username);
        socket.current?.emit("join_game chat", payload);
        
        socket.current?.on("start_game chat", () => {
            console.log("connected with 2 people");
           console.log("chatttt game redirection")
            window.location.href = "/pong_chat"; // ici a coder cette page
        });

        socket.current?.on("room_joined chat", () => 
        {
            console.log("has join " , AuthService.getId());
        });
        socket.current?.on("room_join_error chat",() => {
            alert("Error you canno't join")
        });
        console.log("after emit");
    }
}

export default new ConnectService();