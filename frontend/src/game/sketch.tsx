import { P5CanvasInstance, P5WrapperClassName, P5WrapperProps } from 'react-p5-wrapper'
import Puck from "./puck";
import Paddle from './paddle';
import Confetti from 'react-confetti'

export default function sketch(p5: P5CanvasInstance,) {


  // Puck Class
  // Paddle Class
  
  // in CSS for p5 Wrapper set with and height
  // like this it's can be responssive
  
  //console.log("la width param %d, la height param %d", w, h);

  var canvas = document.getElementById("style");
  if (canvas == null)
  console.log("Le BIG seum il est null")
  else
  console.log("dans sketch width de canvas vaut %d", canvas.style.width);
  var ele = document.querySelector("style");
  if (ele)
    console.log("dans sketch width de canvas vaut %d", ele.style);
  else 
    console.log("ENCORE le seum haha")
    //console.log("Sketch width de canvas %d", canvas.style.width);
  let width = 1600;
  let height = 1200;
  
  let puck = new Puck(p5, width, height);
  let paddle_left = new Paddle(p5, width, height, true);
  let paddle_right = new Paddle(p5, width, height, false);
  let left_score: number = 0;
  let right_score: number = 0;
  let stop : number = 1;
  
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    }
    
    p5.draw = () => {
        p5.background(60);

        if (left_score == 10 || right_score == 10)
        {
          if (left_score == 10)
          {
            p5.text("FINISH", width / 2 - 100, height / 2 - 50);
            p5.text("LEFT PLAYER WIN", width / 2 - 225, height / 2 + 50)
            return (<Confetti width={1440} height={150}/>)
          }
          if (right_score == 10)
          {
            p5.text("FINISH", width / 2 - 100, height / 2 - 50);
            p5.text("RIGHT PLAYER WIN", width / 2 - 200, height / 2 + 50)
            return (<Confetti width={1440} height={150}/>)
          }
        }
        else {

          center_bar();
          
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
          p5.textSize(45);
          p5.text(left_score, width / 2 - 35, 40)
          p5.text(right_score, width / 2 + 30, 40)
        }
      };

    
    const center_bar = () => {
      for (let i: number = 0; i < height; i+= 10)
      {
        p5.rect(width / 2 + 8, i, 10, 15);
        i += 10;
      }
    }

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
    }
    function windowResized() {
      console.log("window resized P5 function called");
      p5.resizeCanvas(width, height);
    }
  }