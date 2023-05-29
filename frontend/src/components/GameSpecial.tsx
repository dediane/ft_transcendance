import React, { useCallback , useContext, useState, useEffect} from "react";
import dynamic from "next/dynamic";
import { P5CanvasInstance, P5WrapperProps, SketchProps } from 'react-p5-wrapper'
import sketch from "@/game/Sketch_extra";
import {ContextGame} from '../game/GameContext'
import { Socket } from "socket.io-client";
import { useRouter } from "next/router";
import authenticationService from "@/services/authentication-service";
import userService from '@/services/user-service';

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
  return (
    <div id="canvas_size">
      <ReactP5Wrapper sketch={sketch} socket={socket} id={userdata.id} username={userdata.username}/>
    </div>
  )
}

Game.displayName = "Game"