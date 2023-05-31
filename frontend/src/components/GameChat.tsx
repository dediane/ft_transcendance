import React from "react";
import dynamic from "next/dynamic";
import { P5CanvasInstance, P5WrapperProps, SketchProps } from 'react-p5-wrapper'
import sketch from "@/game/Sketch_chat";
import {ContextGame} from '../game/GameContext'
import { Socket } from "socket.io-client";
import authenticationService from "@/services/authentication-service";
import userService from '@/services/user-service';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const ReactP5Wrapper = dynamic(
  () => import('react-p5-wrapper').then(mod => mod.ReactP5Wrapper),
  { ssr: false }
) as React.NamedExoticComponent<P5WrapperProps>;

type DefaultEventsMap = /*unresolved*/ any;
export interface MySketchProps extends SketchProps {
  socket: React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null> | null ;
  id: number
  username: string
}

export default function Game() {
  const {socket} = React.useContext(ContextGame);
  const [userdata, setUserData] = useState({username: "", id: ""});
  const router = useRouter();

  useEffect(() => {
    const fetch_profile = async () => {
      const result = await userService.profile()
      setUserData({...result})
    }
    // if(!authenticationService.isAuthentificated()) 
    //   router.push('/login')
    fetch_profile();
  }, [router]);

  useEffect(() => {
    const handleRouteChange = (url: any) => {
      // Perform actions when the route changes
      console.log("");
      const payload = {id : userdata.id, game: "chat"}
      socket?.current?.emit("change page",payload)
    };
  
    // Subscribe to the router events
    router.events.on('routeChangeComplete', handleRouteChange);
  
    // Clean up the event listener on component unmount
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [userdata, router.events, socket]);
  return (
    <div id="canvas_size">
      <ReactP5Wrapper sketch={sketch} socket={socket} id={userdata.id} username={userdata.username}/>
    </div>
  )
}

Game.displayName = "Game"
