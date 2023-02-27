import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import { P5CanvasInstance, P5WrapperProps } from 'react-p5-wrapper'
import sketch from "@/game/sketch";

const ReactP5Wrapper = dynamic(() => import('react-p5-wrapper')
    .then(mod => mod.ReactP5Wrapper as P5CanvasInstance), {
    ssr: false
}) as unknown as React.NamedExoticComponent<P5WrapperProps>

export default function Game() {
  return (
    <ReactP5Wrapper sketch={sketch}/>
  )
}