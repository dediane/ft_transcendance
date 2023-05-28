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

// export default function Wait() {
    
//     const {socket} = useContext(ContextGame);
//     const [userdata, setUserData] = useState({username: "", id: ""});
//     const router = useRouter();
    
//     // useEffect(() => {
        
//     // }, [join, router])
    
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
    
//     if (!socket)
//         return null;

//     return (
//         <div>
//             <WelcomeText style={{fontWeight: 'bold', fontSize: "2rem"}}>
//                 Wait your mate come to play </WelcomeText> 
//         </div>
//     )
// }





export default function Wait() {


  const [userdata, setUserData] = useState({id: "",  username: ""});
  const router = useRouter();

  const fetchProfile = async () => {
    const result = await userService.profile();
    setUserData({ ...result });
  };

  useEffect(() => {
    if (!authenticationService.getToken()) {
      router.push('/login');
    } else {
      fetchProfile();
    }
  }, [router]);


    
    const {socket} :any = useContext(ContextGame);
    useEffect(() => {
        const join = async () => {
          if (userdata !== null) {
            await ConnectService.Connect(socket, Number(userdata.id), userdata.username);
          }
        };
        join();
      }, [userdata, socket]);
    
    if (!socket)
        return null;

    return (
        <div>
            <WelcomeText style={{fontWeight: 'bold', fontSize: "2rem"}}>
                Wait your mate come to play </WelcomeText> 
        </div>
    )
}
