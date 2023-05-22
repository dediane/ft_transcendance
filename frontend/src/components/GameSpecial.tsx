import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import { P5CanvasInstance, P5WrapperProps } from 'react-p5-wrapper'
import sketch from "@/game/Sketch_extra";
import {ContextGame} from '../game/GameContext'

//import styles from "../styles/ReactP5Wrapper.module.css"
import styles from "../styles/Game.module.css"

const ReactP5Wrapper = dynamic(() => import('react-p5-wrapper')
    .then(mod => mod.ReactP5Wrapper as P5CanvasInstance), {
    ssr: false
}) as unknown as React.NamedExoticComponent<P5WrapperProps>

export default function Game() {
  const {socket} = React.useContext(ContextGame);
  return (
    <div id="canvas_size">
      <ReactP5Wrapper sketch={sketch} socket={socket} />
    </div>
  )
}

Game.displayName = "Game"