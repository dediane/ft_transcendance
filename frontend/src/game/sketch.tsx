import { P5CanvasInstance, P5WrapperProps } from 'react-p5-wrapper'
import Puck from "./puck";

export default function sketch(p5: P5CanvasInstance) {

    // Puck Class 
    let width = p5.windowWidth;
    let height = p5.windowHeight - 69;

    let puck = new Puck(p5, width, height);
    p5.setup = () => {
      p5.createCanvas(width, height);
    }
  
    p5.draw = () => {
      p5.background(0);
      //p5.ellipse(p5.windowWidth / 2, p5.windowHeight / 2, 455, 455);
      puck.update();
      puck.edges();
      puck.show();
    };
}