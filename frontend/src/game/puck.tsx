import { P5CanvasInstance } from 'react-p5-wrapper';
import Paddle from './paddle';


export default class Puck {
    // variable in my class
    p: P5CanvasInstance;
    x: number;
    y: number;
    xspeed: number;
    yspeed: number;
    width: number;
    height: number;
    r: number;
    angle: number;

    // constructor
    constructor(pfive: P5CanvasInstance, width: number, height: number) {
        this.p = pfive;
        this.width = width; 
        this.height = height;
        this.r = 12;
        this.x = width / 2;
        this.y = height / 2;
        this.angle = this.p.random(this.p.TWO_PI);
        this.xspeed = 5 * this.p.cos(this.angle);
        this.yspeed = 5 * this.p.sin(this.angle);
    };

    // function 

    // reset when it's quit the canvas window
    reset() {
        this.x = this.width / 2;
        this.y = this.height / 2;
        this.angle = this.p.random(this.p.TWO_PI);
        this.xspeed = 5 * this.p.cos(this.angle);
        this.yspeed = 5 * this.p.sin(this.angle);
    }

    update() {
        this.x = this.x + this.xspeed;
        this.y = this.y + this.yspeed;
    }

    // move the puck
    edges(left_score: number, right_score: number) : [left_score: number, right_score:number] {
        if (this.y < 0 || this.y > this.height) {
            this.yspeed *= -1;
        }
        if (this.x > this.width)
        {
            left_score++;
            this.reset();
        }
        if (this.x < 0)
        {
            right_score++;
            this.reset();
        }
        return [left_score, right_score];
    }

    show() {
        this.p.fill(255);
        this.p.ellipse(this.x, this.y, this.r * 2, this.r * 2);
    }

    checkPaddleLeft(p: Paddle)
    {
        if (this.y < p.y + p.h / 2 && this.y > p.y - p.h / 2 && this.x - this.r < p.x - p.w / 2) {
            this.xspeed *= -1;
        }
    }
    
    checkPaddleRight(p: Paddle)
    {
        if (this.y < p.y + p.h / 2 && this.y > p.y - p.h / 2 && this.x + this.r > p.x - p.w / 2) {
            this.xspeed *= -1;
        }
    }

// end bracket of the Puck class
}