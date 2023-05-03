import { P5CanvasInstance, P5WrapperClassName, P5WrapperProps } from 'react-p5-wrapper'
import Puck from "./puck";
import Paddle from './paddle';
import Confetti from 'react-confetti'
import { useState, useEffect } from "react";
import { io } from 'socket.io-client';
import { useRef } from 'react';
import  AuthService from "../services/authentication-service"



export default function sketch(p5: P5CanvasInstance, innerWidth: number, innerHeight: number) {

  const socketRef = useRef();

  useEffect(() => {

    const userdata = {
      id: AuthService.getId(),
      name: AuthService.getUsername(),
    };

    socketRef.current.on("update ball", () => { // receive from back
      console.log("connected to server");
    });

    socketRef.current.emit("launch ball"); // envoie au back
    console.log(`Received message from server:`);

  }, []);


  // Puck Class
  // Paddle Class

  // in CSS for p5 Wrapper set with and height
  // like this it's can be responssive

  //console.log("la width param %d, la height param %d", w, h);
  let p5WrapperDiv = document.getElementById("canvas_size")
  console.log("> Begin function canvas")
  let width = p5WrapperDiv?.clientWidth || window.innerWidth;
  let height = p5WrapperDiv?.clientHeight || window.innerHeight;
  console.log("clienbtHeight", p5WrapperDiv?.clientHeight)

  let puck = new Puck(p5, width, height);
  let paddle_left = new Paddle(p5, width, height, true);
  let paddle_right = new Paddle(p5, width, height, false);
  let left_score: number = 0;
  let right_score: number = 0;
  let stop: number = 1;

  window.addEventListener('resize', windowResized);
  p5.setup = () => {
    p5.createCanvas(width, height);
  }

  p5.draw = () => {
    p5.background(0);

    if (left_score == 10 || right_score == 10) {
      if (left_score == 10) {
        p5.text("FINISH", width / 2 - 100, height / 2 - 50);
        p5.text("LEFT PLAYER WIN", width / 2 - 225, height / 2 + 50)
        return (<Confetti width={1440} height={150} />)
      }
      if (right_score == 10) {
        p5.text("FINISH", width / 2 - 100, height / 2 - 50);
        p5.text("RIGHT PLAYER WIN", width / 2 - 225, height / 2 + 50)
        return (<Confetti width={1440} height={150} />)
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

      // show scores
      p5.fill(255);
      p5.textSize(45);
      p5.text(left_score, width / 2 - 35, 40)
      p5.text(right_score, width / 2 + 30, 40)
    }
  };


  const center_bar = () => {
    for (let i: number = 0; i < height; i += 10) {
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
    var element = document.getElementById("canvas_size");
    if (element == null)
    {
      console.log("use the window canvas T-T")
      width = window.innerWidth;
      height = window.innerHeight;
    }
    else
    {
      console.log("pass par notre div define hihi")
      width = element.clientWidth;
      height = element.clientHeight;
    }


    console.log("window resized P5 function called w: %d, h: %d", width, height);
    p5.resizeCanvas(width, height);
    paddle_left.update_resize(width, height, true);
    paddle_right.update_resize(width, height, false);
    puck.update_resize(width, height);
  }
}