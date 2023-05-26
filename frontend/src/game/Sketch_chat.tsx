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

    // fixed canvas in backend
    const canvasw = 500;
    const canvash = 500;
    
    
    /*
    let width = p5WrapperDiv?.clientWidth || window.innerWidth;
    let height = p5WrapperDiv?.clientHeight || window.innerHeight;
    */
    let cwidth = p5WrapperDiv?.clientWidth || window.innerWidth;
    let cheight = p5WrapperDiv?.clientHeight || window.innerHeight;
    // Calculate the aspect ratio of the canvas and window
    const canvasratio = canvasw / canvash;
    const winratio = cwidth / cheight;

    // Calculate the available width and height based on the aspect ratio
    let width: number;
    let height: number;

    if (winratio > canvasratio) {
      height = cheight;
      width = height * winratio;
    } else {
      width = cwidth;
      height = width / canvasratio;
    }
   /*
    width = 500;
    height = 500;
   */
    console.log("clienbtHeight", width)
    console.log("clienbtHeight", height)
    let puck = new Puck(p5, width, height);
    let paddle_left = new Paddle(p5, width, height, true, false);
    let paddle_right = new Paddle(p5, width, height, false, false);
    let left_score: number = 0;
    let right_score: number = 0;
    
    const token =  AuthService.getToken();
    let left = false;
    let puckx: number;
    let pucky: number

    let padr_x: number;
    let padr_y: number;
    let padr_w: number;
    let padr_h: number;
    let padr_n: string;
    
    let padl_x: number;
    let padl_y: number;
    let padl_w: number;
    let padl_h: number;
    let padl_n: string;

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
          socket?.emit("start game chat", payload);
          
          socket?.on("puck update chat", (payload : any) => {
            
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
          
          socket?.on("end game", () => {
            console.log("redirection my bro")
            window.location.href = "/home_game";
          });

          socket?.on("paddle update chat", (payload : any) => {
            console.log("update paddle");
            padl_x = payload.plx; 
            padl_y = payload.ply;
            padl_w = payload.plw;
            padl_h = payload.plh;
            padl_n = payload.pln;
            
            padr_x = payload.prx; 
            padr_y = payload.pry;
            padr_w = payload.prw;
            padr_h = payload.prh;
            padr_n = payload.prn;

            //console.log("on lance la ball avec data ", puckx, pucky)
            
            // need data for showwing the ball we need
            // puck.x, puck.y, puck.r
            // to show
          });

          socket?.on("user left", () => {
          
            console.log("we receive lefttttt")
            left = true;
          });       
          // keyReleased and keyPressed for the gamers
          p5.keyReleased = () => {
            console.log("player key relased ")
            socket?.emit("KeyReleased chat");
          }

          p5.keyPressed = () => {
            console.log("keyPressed by ", userdata.name);
            if (p5.key == 'w')
              socket?.emit("KeyPressed chat", {name: userdata.name, key: 'w'});
            else if (p5.key == 's') {
              socket?.emit("KeyPressed chat", {name: userdata.name, key: 's'});
            }
          }
        }
      }
    };
    
  // Puck Class
  // Paddle Class



  window.addEventListener('resize', windowResized);
  p5.setup = () => {
    p5.createCanvas(width, height);
  }

  p5.draw = () => {
    p5.background(0);
    let score = 5
    if (left_score == score || right_score == score || left == true) {
      if (left_score == score) {
        p5.text("End Game", width / 2 - 100, height / 2 - 50);
        let str = "Player " + paddle_left.name + " win !!"
        p5.fill(0, 102, 153);
        p5.text(str, width / 2 - 225, height / 2 + 50)
        return ;
      }
      if (right_score == score) {
        p5.text("End Game", width / 2 - 100, height / 2 - 50);
        let str = "Player " + paddle_right.name + " win !!"
        p5.fill(0, 102, 153);
        p5.text(str, width / 2 - 225, height / 2 + 50)
        return ;
      }
      if (left == true)
      {
        p5.text("End Game", width / 2 - 100, height / 2 - 50);
        let str = "User left the game, You win !!"
        p5.fill(0, 102, 153);
        p5.text(str, width / 2 - 225, height / 2 + 50)
        return ;
      }
    }
    else {
      center_bar();

      paddle_left.show(false, padl_x, padl_y, padl_w, padl_h, padl_n);
      paddle_right.show(false, padr_x, padr_y, padr_w, padr_h, padr_n);
      puck.show(puckx, pucky);
      // show scores
      p5.fill(255);
      p5.textSize(45);
      p5.text(left_score, width / 2 - 35, 40)
      p5.text(paddle_left.name, 100, 40)
      p5.text(right_score, width / 2 + 30, 40)
      p5.text(paddle_right.name, width - 100, 40)
    }
  };


  const center_bar = () => {
    for (let i: number = 0; i < height; i += 10) {
      p5.rect(width / 2 + 8, i, 10, 15);
      i += 10;
    }
  }
  
  function windowResized() {
    console.log("window resized P5 function called w: %d, h: %d", width, height);
    var element = document.getElementById("canvas_size");
    if (element == null)
    {
      console.log("use the window canvas T-T")
      cwidth = window.innerWidth;
      cheight = window.innerHeight;
    }
    else
    {
      console.log("pass par notre div define hihi")
      cwidth = element.clientWidth;
      cheight = element.clientHeight;
    }
    // send to back new width and height to upfate whith puck paddle

    // new winratio
    
    const winratio = cwidth / cheight;

    if (winratio > canvasratio) {
      height = cheight;
      width = height * winratio;
    } else {
      width = cwidth;
      height = width / canvasratio;
    }
    

    p5.resizeCanvas(width, height);
    //paddle_left.update_resize(width, height, true);
    //paddle_right.update_resize(width, height, false);
    //puck.update_resize(width, height);
  }
}