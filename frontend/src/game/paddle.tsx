import { P5CanvasInstance } from 'react-p5-wrapper';


export default class Paddle {
    // var in my class
    p: P5CanvasInstance;
    x: number;
    y: number;
    xspeed: number;
    yspeed: number;
    w: number;
    h: number;
    width: number;
    height: number;
    ychange: number

    // constructor
    constructor(pfive: P5CanvasInstance, width: number, height: number, left: boolean) {
        this.p = pfive;
        this.w = 20;
        this.h = 100;
        // width and height of my paddle

        this.width = width;
        this.height = height;
        // width and height of position of my paddle
        if (left == true)
            this.x = this.w;
        else 
            this.x = this.width - this.w;
        this.y = height / 2;
        
        this.xspeed = 3;
        this.yspeed = 4;
        this.ychange = 0;
    };

    // fonction

    update() {
        this.y += this.ychange;
        this.y = this.p.constrain(this.y, this.h / 2,  this.height - this.h / 2);
        // constrain the paddle to quit the canvas window //
    }

    update_resize(w:number, h:number, left: boolean)
    {
        this.width = w;
        this.height = h;
        if (left == true)
            this.x = this.w;
        else 
            this.x = this.width - this.w;
    }

    move (steps: number) {
        this.ychange = steps;
    }

    show(){
        this.p.fill(255);
        this.p.rectMode(this.p.CENTER); // -> here to change center //
        this.p.rect(this.x, this.y, this.w, this.h);
    }
}