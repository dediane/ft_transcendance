import React from "react";
import { Socket } from "socket.io-client";
import { useState, useEffect } from "react";
import { useRouter} from "next/router";
import authenticationService from "@/services/authentication-service";
import userService from '@/services/user-service';

type DefaultEventsMap = /*unresolved*/ any;
class ConnectService {

    public async Connect(socket : React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null> | null, id: number, username: string) {        
        if (!socket)
            return ;
        const payload = {userid: id, username: username}
        console.log("payload ", payload)
        socket.current?.emit("join_game chat", payload);
        
        socket.current?.on("start_game chat", () => {
            console.log("everyone joined")
            window.location.href = "/pong_chat"; // ici a coder cette page
        });

        socket.current?.on("room_joined chat", () => 
        {
            console.log("i joined")
        });
        socket.current?.on("room_join_error chat",() => {
            alert("Error you canno't join")
        });
    }
}

const connectServiceInstance = new ConnectService();
export default connectServiceInstance;