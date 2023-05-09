import { useEffect, useRef, useState } from "react";
import React from "react";
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import AuthService from "../services/authentication-service"
import { createContext } from "react";

export interface IGameContextProps { // type des variable set
        InRoom: boolean;
        setInRoom: (inRoom: boolean) => void ;
        socket: React.MutableRefObject<undefined> | null;
}

function create() : React.MutableRefObject<undefined> {
    useEffect(() => {
        
        
        socketRef.current  = io("http://localhost:8000", {
        })
      }, []);
      
      
      
      const socketRef = useRef();
      return socketRef;
}

const ContextGame = createContext<IGameContextProps>({
  InRoom: false,
  setInRoom: (inRoom: boolean) => {},
  socket: null,
});

const ContextProviderGame = ({children} : {children : React.ReactNode}) => {
  const [InRoom, setInRoom] = useState(false);
  const socket = create();

  return (
    <ContextGame.Provider value={{InRoom, setInRoom, socket}}>
      {children}
    </ContextGame.Provider>
  );
}

export { ContextGame, ContextProviderGame };

// export const defaultState: IGameContextProps = {
          

//     isInRoom: false,
//     setInRoom: () => {},
//     socket: socketRef
// }
