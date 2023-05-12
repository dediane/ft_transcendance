import React, { useEffect } from 'react';
import { useRouter } from "next/router";
import Link from "next/link";
import styled from '@emotion/styled';
import SocketService from "../services/index_socket_game"
import { JoinRoom } from '@/game/JoinRoom';
import { useState, useRef } from 'react';
import AuthService from "../services/authentication-service"
import { io } from 'socket.io-client';
import styles from '@/styles/Home_Game.module.css';
import authenticationService from '../services/authentication-service';

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
  
  
  
  // const connectSocket = async() => {
    //   const socket = await SocketService
    //   .connect("http://localhost:8000")
    //   .catch((err : any) => {
      //     console.log("Error: ", err);
      //   })
      // }

      



      
    return (
    <HomeGameContainer>
      {/* <h1 style={{ color: 'Purple', fontWeight: 'bold', fontSize: "2rem"}}> Welcome to Pong games</h1> */}
      <WelcomeText style={{fontWeight: 'bold', fontSize: "2rem"}} >Welcome to Pong games</WelcomeText>
      <MainContainer>
        <ul>
          <JoinRoom mode="Classic"/>
          {/* <JoinRoom mode="Extra"/>  */}
        </ul>
      </MainContainer>
    </HomeGameContainer>
  )
}
export default HomeGame
