import { P5CanvasInstance, P5WrapperClassName, P5WrapperProps } from 'react-p5-wrapper'
import Puck from "./puck";
import Paddle from './paddle';
import Confetti from 'react-confetti'
import { useState, useEffect } from "react";
import { Socket, io } from 'socket.io-client';
import { useRef } from 'react';
import AuthService from '../services/authentication-service'
import { MySketchProps } from '@/components/Game';
import React from 'react';



  export default function sketch(p5: P5CanvasInstance<MySketchProps>)  {

    // in CSS for p5 Wrapper set with and height
    // like this it's can be responssive
    
    //console.log("la width param %d, la height param %d", w, h);
    let p5WrapperDiv = document.getElementById("canvas_size")
    const username = AuthService.getUsername();
    console.log("socket username->", username);
    //console.log("id socket -> ", socket.id);
    console.log("> Begin function canvas")
    let width = p5WrapperDiv?.clientWidth || window.innerWidth;
    let height = p5WrapperDiv?.clientHeight || window.innerHeight;
    console.log("clienbtHeight", width)
    console.log("clienbtHeight", height)
    let puck = new Puck(p5, width, height);
    let paddle_left = new Paddle(p5, width, height, true, false);
    let paddle_right = new Paddle(p5, width, height, false, false);
    let left_score: number = 0;
    let right_score: number = 0;
    
    const token =  AuthService.getToken();
    //let start = false;
    let puckx: number;
    let pucky: number

    let padr_x: number;
    let padr_y: number;
    let padr_w: number;
    let padr_h: number;

    let padl_x: number;
    let padl_y: number;
    let padl_w: number;
    let padl_h: number;

    if (!token) {
      // Redirect to the login page
      window.location.href = "/login";
    }
    
    
    const userdata = {
      id: AuthService.getId(),
      name: AuthService.getUsername(),
    };
    
    let socket = Socket;
    const payload = {width: width, height: height, id: userdata.id, name: userdata.name}
    
    p5.updateWithProps = props => {
      let socket = props.socket.current;
      
      if (props.socket) {
        if (socket)
        {
          console.log("socket id ", socket.id)
          socket?.emit("start game", payload);
          
          socket?.on("puck update", (payload : any) => {
            
            puckx = payload.x; 
            pucky = payload.y;
            left_score = payload.lscore;
            right_score = payload.rscore;
            //puck.show(puckx, pucky);
            //console.log("on lance la ball avec data ", puckx, pucky)
            
            // need data for showwing the ball we need
            // puck.x, puck.y, puck.r
            // to show
          });

          socket?.on("paddle update", (payload : any) => {
            padl_x = payload.plx; 
            padl_y = payload.ply;
            padl_w = payload.plw;
            padl_h = payload.plh;

            padr_x = payload.prx; 
            padr_y = payload.pry;
            padr_w = payload.prw;
            padr_h = payload.prh;

            //console.log("on lance la ball avec data ", puckx, pucky)
            
            // need data for showwing the ball we need
            // puck.x, puck.y, puck.r
            // to show
          });

          // keyReleased and keyPressed for the gamers
          p5.keyReleased = () => {
            console.log("player key relased ")
            socket?.emit("KeyReleased");
          }
          const payloadm = {id: userdata.id}
          p5.keyPressed = () => {
            console.log("keyPressed");
            if (p5.key == 'j')
              socket?.emit("KeyPressed", {id: userdata.id, key: 'j'});
            else if (p5.key == 'n') {
              socket?.emit("KeyPressed", {id: userdata.id, key: 'n'});
            }
            // if (p5.key == 'j')
            // socket?.emit("KeyPressed up right");
            // else if (p5.key == 'n') {
            //   socket?.emit("KeyPressed down right");
            // }
          }
        }
      }
      // ici faire emit et on avec des appelle de function
    };
    
  // Puck Class
  // Paddle Class



  window.addEventListener('resize', windowResized);
  p5.setup = () => {
    p5.createCanvas(width, height);
  }

  p5.draw = () => {
    p5.background(0);

    if (left_score == 5 || right_score == 5) {
      if (left_score == 5) {
        p5.text("FINISH", width / 2 - 100, height / 2 - 50);
        p5.text("LEFT PLAYER WIN", width / 2 - 225, height / 2 + 50)
        return (<Confetti width={1440} height={150} />)
      }
      if (right_score == 5) {
        p5.text("FINISH", width / 2 - 100, height / 2 - 50);
        p5.text("RIGHT PLAYER WIN", width / 2 - 225, height / 2 + 50)
        return (<Confetti width={1440} height={150} />)
      }
    }
    else {
      center_bar();

      paddle_left.show(false, padl_x, padl_y, padl_w, padl_h);
      paddle_right.show(false, padr_x, padr_y, padr_w, padr_h);
      puck.show(puckx, pucky);
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
    //paddle_left.update_resize(width, height, true);
    //paddle_right.update_resize(width, height, false);
    puck.update_resize(width, height);
  }
}