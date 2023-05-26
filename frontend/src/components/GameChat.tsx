import React from "react";
import dynamic from "next/dynamic";
import { P5CanvasInstance, P5WrapperProps, SketchProps } from 'react-p5-wrapper'
import sketch from "@/game/Sketch_chat";
import {ContextGame} from '../game/GameContext'

const ReactP5Wrapper = dynamic(() => import('react-p5-wrapper')
    .then(mod => mod.ReactP5Wrapper as P5CanvasInstance), {
    ssr: false
}) as unknown as React.NamedExoticComponent<P5WrapperProps>

export interface MySketchProps extends SketchProps {
  socket: React.MutableRefObject<undefined>;
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
