import React, { useContext } from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { useConst } from "@chakra-ui/react";
import socketService from "../services/index_socket_game"
import gameService from "../services/index_game"
import AuthService from "../services/authentication-service"
import {ContextGame} from '../game/GameContext'


const JoinRoomContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 2em;
  `;

  const RoomIdInput = styled.input`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #8e44ad;
  border-radius: 3px;
  padding: 0 10px;
  `;

  const JoinButton = styled.button`
  outline: none;
  background-color: #8e44ad;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 230ms ease-in-out;
  margin-top: 1em;
  cursor: pointer;
  &:hover {
    background-color: transparent;
    border: 2px solid #8e44ad;
    color: #8e44ad;
  }
`;

interface IJoinRoomProps {
  mode : string;
}

export function JoinRoom(props: IJoinRoomProps) 
{
  const [roomName, setRoomName] = useState("GameRoom");
  const [isJoining, setJoining] = useState(false);

  const {socket} = React.useContext(ContextGame);

  const handleRoomName = (e: React.ChangeEvent<any>) => {
    const value = e.target.value;
    setRoomName(value);
  }
  
  const joinRoom = async (e: React.FormEvent) => {
    if (!socket)
      return ;
    setJoining(true);
    
    const joined = await gameService
    .joinGameRoom(socket, roomName, props.mode).catch((err) => {
      alert(err);
    });
    setJoining(false);
  }

  return <div>
      <JoinRoomContainer >
        <h4> Join the {props.mode} Pong game </h4>
        <JoinButton type="submit" disabled={isJoining} onClick={joinRoom}>{isJoining ? "Joining ... " : "Join" }</JoinButton>
      </JoinRoomContainer>
  </div>
}