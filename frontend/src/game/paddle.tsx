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
    ychange: number;
    name: string;

    // constructor
    constructor(pfive: P5CanvasInstance, width: number, height: number, left: boolean, e: boolean) {
        this.p = pfive;
        this.w = 20;
        if (e == true)
            this.h = 150;
        else
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
        this.name = "";
    };

    // fonction

    // update() {
    //     this.y += this.ychange;
    //     this.y = this.p.constrain(this.y, this.h / 2,  this.height - this.h / 2);
    //     // constrain the paddle to quit the canvas window //
    // }

    update_resize(wi:number, h:number, left: boolean, x: number, w: number)
    {
        this.width = w;
        this.height = h;
        if (left == true)
            this.x = w;
        else 
            this.x = this.width - this.w;
    }

    // move (steps: number) {
    //     this.ychange = steps;
    // }

    show(e: boolean, x: number, y: number, w: number, h: number, n: string){
        const canvasWidth = 500; // Fixed canvas width
        const canvasHeight = 500; // Fixed canvas height

        // Calculate the ratio for x and y positions
        let xratio = this.width / canvasWidth;
        let yratio = this.height / canvasHeight;

        // Apply the ratio to the x and y positions
        let tx = x * xratio;
        let ty = y * yratio;
        if (e == false){   
            this.p.fill(255);
            this.p.rectMode(this.p.CENTER); // -> here to change center //
            this.p.rect(tx, ty, w, h);
        } else {
            this.p.fill(this.p.color('#8d2bd2')); 
            this.p.noStroke();
            this.p.rectMode(this.p.CENTER); // -> here to change center //
            this.p.rect(tx, ty, w, h, 7);
        }
        this.name = n;
    }
}