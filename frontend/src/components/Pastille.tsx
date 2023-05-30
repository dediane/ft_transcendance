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
    const { allUsers, setAllUsers } = useContext(ContextGame);

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


    const handleheartbeat = () => {
    // console.log("navigator.onLine", navigator.onLine)
    // console.log("userdata ", userData.username)
    if (userData.username)
    {
        console.log("my user")
        console.log("my user is ", userData.id, userData.username)

        socket?.current?.emit("join server all", {id: userData.id, username: userData.username});
          
        socket?.current?.on("connected all users", (users: any) => {
        setAllUsers(users);
        });
        console.log(allUsers);
    }
  };

  
    useEffect(() => {
      if (!userData) return;
      handleheartbeat();
    }, [userData, socket]);
    return (<div>

    </div>);
}