import { useEffect, useRef, useState } from "react";
import React from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import AuthService from "../services/authentication-service"
import { createContext } from "react";

export interface IGameContextProps { // type des variable set
        InRoom: boolean;
        setInRoom: (inRoom: boolean) => void ;
        socket: React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null> | null
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
  InRoom: false,
  setInRoom: (inRoom: boolean) => {},
  socket: null,
});

const ContextProviderGame = ({children} : {children : React.ReactNode}) => {
  const [InRoom, setInRoom] = useState(false);
  // const socket = create();
  //let socket :  React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null> 
  let socket : React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null> | null 
  socket = Create();
  return (
    <ContextGame.Provider value={{InRoom, setInRoom, socket}}>
      {children}
    </ContextGame.Provider>
  );
}

export { ContextGame, ContextProviderGame };

