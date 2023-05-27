import React from "react";
import dynamic from "next/dynamic";
import { P5CanvasInstance, P5WrapperProps, SketchProps } from 'react-p5-wrapper'
import sketch from "@/game/Sketch";
import  { ContextGame }  from '../game/GameContext'
import { useContext } from "react";

const ReactP5Wrapper = dynamic(
  () => import('react-p5-wrapper').then(mod => mod.ReactP5Wrapper),
  { ssr: false }
) as React.NamedExoticComponent<P5WrapperProps>;

export interface MySketchProps extends SketchProps {
  socket: React.MutableRefObject<undefined>;
}

export default function Game() {
  const {socket} = useContext(ContextGame);

  return (
    <div id="canvas_size">
      <ReactP5Wrapper sketch={sketch} socket={socket} />
    </div>
  )
}

Game.displayName = "Game"
