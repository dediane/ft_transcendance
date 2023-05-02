import React, { useEffect } from 'react';
import styles from '@/styles/Login.module.css'
import { useRouter } from "next/router";
import Link from "next/link";
import styled from '@emotion/styled';
import SocketService from "../services/index_socket_game"
import { JoinRoom } from '@/game/JoinRoom';
import { useState } from 'react';
import GameContext from '@/game/GameContext';
import { IGameContextProps} from '@/game/GameContext';


const HomeGameContainer = styled.div`
  width: 100%; 
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: lem; 
`;

const WelcomeText = styled.h1`
  margin: 0;
  color: #8e44ad;
`;

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;


function HomeGame() {

  const [isInRoom, setInRoom ] = useState(false);

  const connectSocket = async() => {
    const socket = await SocketService
    .connect("http://localhost:8000")
    .catch((err : any) => {
      console.log("Error: ", err);
    })
  }

  useEffect(() => {
    connectSocket();
  }, []);

  const gameContextValue: IGameContextProps = {
    isInRoom,
    setInRoom,
  } 

  return (
    <GameContext.Provider value={gameContextValue}>
    <HomeGameContainer>
      {/* <h1 style={{ color: 'Purple', fontWeight: 'bold', fontSize: "2rem"}}> Welcome to Pong games</h1> */}
      <WelcomeText style={{fontWeight: 'bold', fontSize: "2rem"}} >Welcome to Pong games</WelcomeText>
      <MainContainer>
        <ul>
          <JoinRoom mode="Classic"/>
          {/* <JoinRoom mode="Special"/> */}
        </ul>
      </MainContainer>
    </HomeGameContainer>
    </GameContext.Provider> 
  )
}
export default HomeGame

/*
export const home_game = () => {
    const router = useRouter();

    const handleClick = (path: string) => {
      if (path === "pong") {
        router.push(path);
      }
      if (path === "game") {
        router.push(path);
      }}
    return (
        <div>
        <title>Hello</title>
        
        <button className={styles.button} onClick={() => handleClick("pong")}>
        Classic game</button>
        <button  className={styles.button} onClick={() => handleClick("game")}>
        Special game</button>
        </div>
    );
}
export default home_game;
*/