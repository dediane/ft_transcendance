import React from "react";
import { Socket } from "socket.io-client";
import AuthService from "../services/authentication-service"

class ConnectService {

    public async Connect(socket : React.MutableRefObject<undefined>) {        
        if (!socket)
            return ;
        const payload = {userid: await AuthService.getId(), username: await AuthService.getUsername()}
        console.log("in Connect user is  ", payload.userid, payload.username);
        socket.current?.emit("chat pong", payload);
        
    }
}

export default new ConnectService();