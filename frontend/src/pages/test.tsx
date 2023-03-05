
import * as React from "react";
import { useWindowSize } from "@react-hook/window-size/throttled";
import { useWindowSize as useWindowSizeD } from "@react-hook/window-size";
import useScrollPosition from "@react-hook/window-scroll";

export default function Test() {
    return (
        <App />
    )
}


const  App = ()  => {
  const [width, height] = useWindowSize({ fps: 60 });
  const [widthD, heightD] = useWindowSizeD();
  const scrollY = useScrollPosition(60 /*frames per second*/);

  return (
    <div className="App">
      <h1>Scroll and resize me</h1>
      <div
        style={{
          top: 72,
          left: 0,
          right: 0,
          margin: "auto"
        }}
      >
        <div>scrollY: {scrollY}</div>
        <hr />
        <div>width (throttled): {width}</div>
        <div>height (throttled): {height}</div>
        <hr />
        <div>width (debounced): {widthD}</div>
        <div>height (debounced): {heightD}</div>
      </div>
    </div>
  );
}
