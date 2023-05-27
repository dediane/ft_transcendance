import React from "react";
import dynamic from "next/dynamic";
import { P5CanvasInstance, P5WrapperProps, SketchProps } from 'react-p5-wrapper'
import sketch from "@/game/Sketch_chat";
import {ContextGame} from '../game/GameContext'
import { Socket } from "socket.io-client";

const ReactP5Wrapper = dynamic(
  () => import('react-p5-wrapper').then(mod => mod.ReactP5Wrapper),
  { ssr: false }
) as React.NamedExoticComponent<P5WrapperProps>;

type DefaultEventsMap = /*unresolved*/ any;
export interface MySketchProps extends SketchProps {
  socket: React.MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | null> | null ;
}

export default function Game() {
  const {socket} = React.useContext(ContextGame);

  return (
    <div id="canvas_size">
      <ReactP5Wrapper sketch={sketch} socket={socket} />
    </div>
  )
}

Game.displayName = "Game"
