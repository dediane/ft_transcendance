import { P5CanvasInstance } from 'react-p5-wrapper';
import Paddle from './paddle';
import { useEffect } from 'react';


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
    puck_speed: number;
    
    // constructor
    constructor(pfive: P5CanvasInstance, width: number, height: number) {
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

    // reset when it's quit the canvas window
    reset() {
        this.x = this.width / 2;
        this.y = this.height / 2;
        this.angle = this.p.random(-this.p.PI / 4, this.p.PI / 4);
        this.xspeed = this.puck_speed * this.p.cos(this.angle);
        this.yspeed = this.puck_speed * this.p.sin(this.angle);

        if (this.p.random(1) < 0.5)
            this.xspeed *= -1;
    }

    update() {
        // socket.on("update ball", data_puck)
        this.x = this.x + this.xspeed;
        this.y = this.y + this.yspeed;
    }
    // move the puck

    edges(left_score: number, right_score: number) : [left_score: number, right_score:number] {
        
        if (this.y < 0 || this.y > this.height) {
            let offset = this.yspeed < 0 ? 0 - this.y : this.height - (this.y + this.r)
            this.yspeed *= -1 ;
        }
        if (this.x - this.r > this.width)
        {
            left_score++;
            this.reset();
        }
        if (this.x + this.r < 0)
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

    update_resize(w: number, h: number){
        this.width = w; 
        this.height = h;
        this.r = 12;
        this.x = w / 2;
        this.y = h / 2;
    }

    check(ax: number, ay: number, aw: number, ah: number, bx: number, by: number, bw: number, bh: number) {
        return ax < bx+bw && ay < by+bh && bx < ax+aw && by < ay+ah;
    };

    checkPaddleLeft(p: Paddle, e: boolean, speed: number) : number
    {
        if (this.y < p.y + p.h / 2 && this.y > p.y - p.h / 2 && this.x - this.r < p.x + p.w / 2) {
            if (this.x > p.x)
            {
                let diff : number = this.y - (p.y - p.h / 2);
                let rad : number = this.p.radians(45);
                let angle : number = this.p.map(diff, 0, p.h, -rad, rad);
                this.x = p.x + (p.w / 2) + this.r;
                if (e == true)
                {
                    speed += 0.5;
                    this.xspeed = (this.puck_speed * this.p.cos(angle)) * speed;
                    this.yspeed = (this.puck_speed * this.p.sin(angle)) * speed;
                }
                else {
                    this.xspeed = this.puck_speed * this.p.cos(angle);
                    this.yspeed = this.puck_speed * this.p.sin(angle);
                }
            }
        }
        return (speed)
    }
    
    checkPaddleRight(p: Paddle, e: boolean, speed: number) : number
    {
        if (this.y < p.y + p.h / 2 && this.y > p.y - p.h / 2 && this.x + this.r > p.x - p.w / 2) {
           
            if (this.x < p.x)
            {
                /*
                let diff : number = this.y - (p.y - p.h / 2);
                let rad : number = this.p.radians(135);
                let angle : number = this.p.map(diff, 0, p.h, -rad, rad);
                this.x = p.x - (p.w / 2) - this.r;
                if (e == true)
                {
                    this.xspeed = this.puck_speed * this.p.cos(angle) * speed;
                    this.yspeed = this.puck_speed * this.p.sin(angle) * speed;
                }
                else {
                    this.xspeed = this.puck_speed * this.p.cos(angle);
                    this.yspeed = this.puck_speed * this.p.sin(angle);
                }
                */
                if (e == true)
                {
                    this.xspeed = this.puck_speed * speed;
                    this.yspeed = this.puck_speed * speed;
                }
                else {
                    this.xspeed = this.puck_speed * -1;
                    this.yspeed = this.puck_speed * -1;
                }
            }
        }
        return (speed);
    }

// end bracket of the Puck class
}