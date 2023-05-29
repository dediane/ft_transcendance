import Game from '@/components/Game'
import React, { useEffect, useState, useCallback, useContext } from 'react'
import io, {Socket} from "socket.io-client"
import styled from '@emotion/styled';
import { useRouter} from "next/router";
import authenticationService from "@/services/authentication-service";
import userService from '@/services/user-service';
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
    
  const {socket} = useContext(ContextGame);                           // i need socket to communicate with backend
  const [userdata, setUserData] = useState({username: "", id: ""});   // user's data
  const router = useRouter();                                         // router to redirect to login page
  
  // check the socket exist
  if (!socket)
  return ;

  
  // catch the user profile
  const fetchProfile = async () => {
    const result = await userService.profile();
    setUserData({ ...result });
  };

  // use effect to redirect if someone is not log + set user's data
  useEffect(() => {
      if (!authenticationService.getToken()) {
        router.push('/login');
      } else {
        fetchProfile();
      }
    }, [router]);


    const join = async () => {
      console.log("userdata to join ", userdata.id, userdata.username)
      const payload = {id : userdata.id, username: userdata.username }
      const joinned = ConnectService.Connect(socket, payload);
      // const joinned = ConnectService.Connect(socket, Number(userdata.id), userdata.username);
    }
    
    // use effect to call join function
    useEffect(() => {
      if (userdata != null)
      {
        join();
  
      }
    }, [userdata]);
//     useEffect(() => {
//     const join = useCallback(async () => {
//         const joinned = await ConnectService.Connect(socket, Number(userdata.id), userdata.username);
// }, [socket]);
//     const fetch_profile = async () => {
//         const result = await userService.profile()
//         setUserData({...result})
//     }
//         if(!authenticationService.getToken()) 
//         router.push('/login')
//         fetch_profile();
//         join();
//     }, [router, join]);

  return (
      <div>
          <WelcomeText style={{fontWeight: 'bold', fontSize: "2rem"}}>
              Wait your mate come to play </WelcomeText> 
      </div>
  )
}
