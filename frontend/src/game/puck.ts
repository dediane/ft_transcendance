import { P5CanvasInstance } from 'react-p5-wrapper';


export default class Puck {
    p: P5CanvasInstance;
    x: number;
    y: number;
    xspeed: number;
    yspeed: number;
    w: number;
    h: number;

    constructor(pfive: P5CanvasInstance, width: number, height: number) {
        this.p = pfive;
        this.x = width / 2;
        this.y = height / 2;
        this.xspeed = 3;
        this.yspeed = 4;
        this.w = width; 
        this.h = height; 
    };

    reset() {
        this.x = this.w / 2;
        this.y = this.h / 2;
    }

    update() {
        this.x = this.x + this.xspeed;
        this.y = this.y + this.yspeed;
    }

    edges() {
        if (this.y < 0 || this.y > this.h) {
            this.yspeed *= -1;
        }
        if (this.x > this.w)
            this.reset();
        if (this.x < 0)
            this.reset();
    }

    show() {
        this.p.fill(255);
        this.p.ellipse(this.x, this.y, 24, 24);
    } 
}
