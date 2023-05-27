import Game from '@/components/Game'
import React, { useEffect, useRef, useCallback, useContext } from 'react'
import io, {Socket} from "socket.io-client"
import styled from '@emotion/styled';
import AuthService from "../services/authentication-service"
import {ContextGame} from "@/game/GameContext";
//import ConnectService from '@/components/Connect';
import ConnectService from "../services/Connect"
const WelcomeText = styled.h1`
  margin: 0;
  color: #8e44ad;
  display: flex;
  flex-direct: column;
  align-items: center;
  justify-content: center;
`;

export default function Wait() {
    
    const {socket} :any = useContext(ContextGame);
    const join = useCallback(async () => {
        const joinned = await ConnectService.Connect(socket);
      }, [socket]);
    useEffect(() => {
        join();
    }, [join]);
    
    if (!socket)
        return null;

    return (
        <div>
            <WelcomeText style={{fontWeight: 'bold', fontSize: "2rem"}}>
                Wait your mate come to play </WelcomeText> 
        </div>
    )
}