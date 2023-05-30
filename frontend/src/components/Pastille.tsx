import { useContext, useEffect, useState } from "react";
import { ContextGame } from "@/game/GameContext";
import authenticationService from '@/services/authentication-service';
import { useRouter } from "next/router";
import userService from '@/services/user-service';

export default function Pastille() {
    const {socket} = useContext(ContextGame);
    const {UserStatus, setUserStatus} = useContext(ContextGame);
    const [userData, setUserData] = useState({ username: '', id: '' });
    const router = useRouter();
  
    useEffect(() => {

      if (!socket)
        return;
      const fetchProfile = async () => {
        const result = await userService.profile();
        setUserData({ ...result });
      };
  
      if (!authenticationService.getToken()) {
        router.push('/login');
      } else {
        fetchProfile();
      }
    }, [router, socket]);


    const handleOnlineStatus = () => {
    console.log("navigator.onLine", navigator.onLine)
    if (userData.username)
    {

        if (navigator.onLine == true && userData.username)
        {
            console.log("here navigator with online ", userData.username);
            // setUserStatus("online");
            socket?.current?.emit("online", userData.username);
            
        }
        else
        {
            console.log("here navigator with Offline ", userData.username);
            // setUserStatus("offline");
            socket?.current?.emit("offline", userData.username);
            
        }
    }
  };
  
    useEffect(() => {
      if (!userData) return;
  
      const setstatus = async () => {
        console.log('userdata to join ', userData.id, userData.username);
        const payload = { id: userData.id, username: userData.username };
        // ConnectService.Connect(socket, payload);
      };
  
      setstatus();
    }, [userData, socket]);
    return (<></>)
}