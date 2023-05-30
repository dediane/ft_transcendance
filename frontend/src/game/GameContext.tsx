import { useEffect, useRef, useState } from "react";
import React from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import AuthService from "../services/authentication-service"
import { createContext } from "react";

export interface IGameContextProps { // type des variable set
        UserStatus: string;
        setUserStatus: (userStatus: string) => void ;
        socket: React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null> | null
        allUsers: any[]
        setAllUsers: (userStatus: any[]) => void ;
        // setAllUsers: React.Dispatch<React.SetStateAction<any[]>>; 
        
        //socket : typeof useRef<Socket | null> | null;
}
type DefaultEventsMap = /*unresolved*/ any;

function Create() : React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>  {
  const socketRef = useRef<Socket | null>(null);
    useEffect(() => {
        
        
        socketRef.current  = io("http://localhost:8000", {
        })
      }, []);
      
      return (socketRef);
}

const ContextGame = createContext<IGameContextProps>({
  UserStatus: "offline",
  setUserStatus: (inRoom: string) => {},
  socket: null,
  allUsers: [],
  setAllUsers: (allUsers: any[]) => {},
  // setAllUsers: () => {} 
});

const ContextProviderGame = ({children} : {children : React.ReactNode}) => {
  const[UserStatus, setUserStatus] = useState("offline") // ["online", "offline", "ingame"
  const[allUsers, setAllUsers] = useState([]); // ["online", "offline", "ingame"
  // const socket = create();
  //let socket :  React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null> 
  let socket : React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null> | null 
  socket = Create();
  return (
    <ContextGame.Provider value={{UserStatus, setUserStatus, socket, allUsers, setAllUsers}}>
      {children}
    </ContextGame.Provider>
  );
}

export { ContextGame, ContextProviderGame };

