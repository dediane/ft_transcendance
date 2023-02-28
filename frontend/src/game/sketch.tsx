import { P5CanvasInstance, P5WrapperProps } from 'react-p5-wrapper'
import Puck from "./puck";
import Paddle from './paddle';

export default function sketch(p5: P5CanvasInstance) {

    // Puck Class
    // Paddle Class

    // in CSS for p5 Wrapper set with and height
    // like this it's can be responssive
    let width = p5.windowWidth;
    let height = p5.windowHeight - 69;

    let puck = new Puck(p5, width, height);
    let paddle_left = new Paddle(p5, width, height, true);
    let paddle_right = new Paddle(p5, width, height, false);
    let left_score: number = 0
    let right_score: number = 0
    
    p5.setup = () => {
      p5.createCanvas(width, height);
    }
  
    p5.draw = () => {
      p5.background(0);

      puck.checkPaddleLeft(paddle_left);
      puck.checkPaddleRight(paddle_right);

      // show and update the paddles
      paddle_left.show();
      paddle_right.show();
      paddle_left.update();
      paddle_right.update();

      // show and update the puck
      puck.update();
      [left_score, right_score] = puck.edges(left_score, right_score);
      puck.show();

      p5.fill(255);
      p5.textSize(30);
      p5.text(left_score, 10, 40)
      p5.text(right_score, width - 20, 40)
    };

    // keyReleased and keyPressed for the gamers
   
    p5.keyReleased = () => {
      paddle_left.move(0);
      paddle_right.move(0);
    }
    p5.keyPressed = () => {
      if (p5.key == 'a')
        paddle_left.move(-10);
      else if (p5.key == 'z') {
        paddle_left.move(10);
      }
      if (p5.key == 'j')
        paddle_right.move(-10);
      else if (p5.key == 'n') {
        paddle_right.move(10);
    }
    };
}