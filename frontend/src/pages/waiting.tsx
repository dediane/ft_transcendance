import Game from '@/components/Game'
import React, { useEffect, useRef } from 'react'
import io, {Socket} from "socket.io-client"
import styled from '@emotion/styled';
import AuthService from "../services/authentication-service"
import ConnectService from '@/components/Connect';
import {ContextGame} from "@/game/GameContext";

const WelcomeText = styled.h1`
  margin: 0;
  color: #8e44ad;
  display: flex;
  flex-direct: column;
  align-items: center;
  justify-content: center;
`;

export default function wait() {
    
    const {socket} = React.useContext(ContextGame);
    if (!socket)
        return ;
    const join = async () => {
        const joinned = await ConnectService.Connect(socket);
    }
    useEffect(() => {
        join();
      });

    return (
        <div>
            <WelcomeText style={{fontWeight: 'bold', fontSize: "2rem"}}>
                Wait your mate come to play </WelcomeText> 
        </div>
    )
}