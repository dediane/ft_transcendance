import { P5CanvasInstance } from 'react-p5-wrapper';
import Paddle from './paddle';
import { useEffect } from 'react';
import { MySketchProps } from '@/components/Game';


export default class Puck {
    // variable in my class
    p: P5CanvasInstance<MySketchProps>;
    x: number;
    y: number;
    xspeed: number;
    yspeed: number;
    width: number;
    height: number;
    r: number;
    angle: number;
    puck_speed: number;
    
    // constructor
    constructor(pfive: P5CanvasInstance<MySketchProps>, width: number, height: number) {
        this.p = pfive;
        this.width = width;     //init in back 
        this.height = height;   //init in back
        this.r = 12;
        this.x = width / 2;     //init in back
        this.y = height / 2;    //init in back
        this.puck_speed = 8;
        this.angle = this.p.random(-this.p.PI / 4, this.p.PI / 4);
        this.xspeed = this.puck_speed * this.p.cos(this.angle);
        this.yspeed = this.puck_speed * this.p.sin(this.angle);
    };

    // function 



    show(x: number, y: number) {
        
        const canvasWidth = 1000; // Fixed canvas width
        const canvasHeight = 1000; // Fixed canvas height

        // Calculate the ratio for x and y positions
        let xratio = this.width / canvasWidth;
        let yratio = this.height / canvasHeight;
        let ri = 0;
        // Apply the ratio to the x and y positions
        let tx = x * xratio;
        let ty = y * yratio;
        if (xratio > yratio)
            ri = this.r * xratio
        else
            ri = this.r * yratio
        this.p.fill(255);
        this.p.ellipse(tx, ty, ri * 2, ri * 2);
    }

    update_resize(w: number, h: number){
        this.width = w; 
        this.height = h;
        this.r = 12;
        this.x = w / 2;
        this.y = h / 2;
    }


    // end bracket of the Puck class
}