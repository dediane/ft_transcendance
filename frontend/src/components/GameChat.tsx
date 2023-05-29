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
    if(!authenticationService.getToken()) 
          router.push('/login')
    fetch_profile();
  }, [router]);
  return (
    <div id="canvas_size">
      <ReactP5Wrapper sketch={sketch} socket={socket} id={userdata.id} username={userdata.username}/>
    </div>
  )
}

Game.displayName = "Game"
