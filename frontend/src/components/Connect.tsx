import React from "react";
import { Socket } from "socket.io-client";
import AuthService from "../services/authentication-service"

class ConnectService {

    public async Connect(socket : React.MutableRefObject<undefined>) {        
        if (!socket)
            return ;
        console.log("here before emit connect")
        //const payload = {userid: await AuthService.getId(), username: await AuthService.getUsername()}
        socket.current?.emit("chat pong");
        
        console.log("here after emit connect")
        
    }
}

export default new ConnectService();