import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { P5CanvasInstance, P5WrapperProps, SketchProps } from 'react-p5-wrapper'
import sketch from "@/game/Sketch";
import   { ContextGame } from '../game/GameContext'
import { useContext } from "react";
import { Socket } from "socket.io-client";
import authenticationService from "@/services/authentication-service";
import userService from '@/services/user-service';
import { useRouter } from "next/router";

type DefaultEventsMap = /*unresolved*/ any;
const ReactP5Wrapper = dynamic(
  () => import('react-p5-wrapper').then(mod => mod.ReactP5Wrapper),
  { ssr: false }
) as React.NamedExoticComponent<P5WrapperProps>;

export interface MySketchProps extends SketchProps {
  //socket: React.MutableRefObject<undefined>;
  socket: React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null>
  id: number
  username: string
}

export default function Game() {
  const {socket} = useContext(ContextGame);
  const [userdata, setUserData] = useState({username: "", id: ""});
  const router = useRouter();

  useEffect(() => {
    const fetch_profile = async () => {
      const result = await userService.profile()
      setUserData({...result})
    }
    if(!authenticationService.getToken()) 
          router.push('/login')
    fetch_profile();
  }, [router]);

  useEffect(() => {
    const handleRouteChange = (url: any) => {
      // Perform actions when the route changes
      console.log("");
      const payload = {id : userdata.id, game: "classic"}
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
      <ReactP5Wrapper sketch={sketch} socket={socket} id={userdata.id} username={userdata.username} />
    </div>
  )
}

Game.displayName = "Game"
