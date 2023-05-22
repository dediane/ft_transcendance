import { PrimaryColumnCannotBeNullableError } from 'typeorm';
import Paddle from './paddle';

export  class Puck {
    // variable in my class
    x: number;
    y: number;
    xspeed: number;
    yspeed: number;
    width: number;
    height: number;
    r: number;
    angle: number;
    puck_speed: number;
    left_score: number;
    right_score: number;
    e: boolean;
    speed: number;
    
    // constructor
    constructor( width: number, height: number, e: boolean) {
        this.width = width;     //init in back 
        this.height = height;   //init in back
        this.r = 12;
        this.x = width / 2;     //init in back
        this.y = height / 2;    //init in back
        this.puck_speed = 3;
        this.left_score = 0;
        this.right_score = 0;
        //this.angle = Math.random(- Math.PI / 4, Math.PI / 4);
        this.angle = this.RandomNum(-Math.PI / 4, Math.PI / 4);
        this.xspeed = this.puck_speed * Math.cos(this.angle);
        this.yspeed = this.puck_speed * Math.sin(this.angle);
        if (e == false)
            this.e = false;
        else
            this.e = true;
        this.speed = 1;
    };

    // function 

    degToRad = (deg: number): number => {
        return deg * (Math.PI / 180.0);
      };

    mapValue(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
        return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
      }

    RandomNum(min: number, max: number): number {
        return Math.random() * (max - min) + min;
      }
      
      
    // reset when it's quit the canvas window
    reset() {
        this.x = this.width / 2;
        this.y = this.height / 2;
        this.angle = this.RandomNum(-Math.PI / 4, Math.PI / 4);
        this.xspeed = this.puck_speed * Math.cos(this.angle);
        this.yspeed = this.puck_speed * Math.sin(this.angle);

        if (Math.random() * 1 < 0.5)
            this.xspeed *= -1;
        if (this.e == true)
            this.speed = 1;
    }

    update() {
        this.x = this.x + this.xspeed;
        this.y = this.y + this.yspeed;
    }
    // move the puck

    edges() {
        //console.log("edge puck back")
        if (this.y < 0 || this.y > this.height) {
            let offset = this.yspeed < 0 ? 0 - this.y : this.height - (this.y + this.r)
            this.yspeed *= -1 ;
        }
        if (this.x - this.r > this.width)
        {
            this.left_score++;
            this.reset();
        }
        if (this.x + this.r < 0)
        {
            this.right_score++;
            this.reset();
        }
        return this.speed
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

    checkPaddleLeft(p: Paddle) : number
    {
        //console.log("speed function == ", speed);
        if (this.y < p.y + p.h / 2 && this.y > p.y - p.h / 2 && this.x - this.r < p.x + p.w / 2) {
            if (this.x > p.x)
            {
                let diff : number = this.y - (p.y - p.h / 2);
                let rad : number = this.degToRad(45);
                let angle : number = this.mapValue(diff, 0, p.h, -rad, rad);
                this.x = p.x + (p.w / 2) + this.r;
                if (this.e == true)
                {
                    this.speed += 0.25;
                    this.xspeed = (this.puck_speed * Math.cos(angle)) * this.speed;
                    this.yspeed = (this.puck_speed * Math.sin(angle)) * this.speed;
                    console.log("left we increase speed ", this.speed)
                }
                else {
                    console.log("left NOOO increase ", this.speed)
                    this.xspeed = this.puck_speed * Math.cos(angle);
                    this.yspeed = this.puck_speed * Math.sin(angle);
                }
            }
        }
        return (this.speed)
    }
    
    checkPaddleRight(p: Paddle) : number
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
                if (this.e == true)
                {
                    this.speed += 0.25;
                    this.xspeed = this.puck_speed * this.speed * -1;
                    this.yspeed = this.puck_speed * this.speed * -1;
                    console.log("right we increase speed ", this.speed)
                }
                else {
                    console.log("right NOOO increase speed ", this.speed)
                    this.xspeed = this.puck_speed * -1;
                    this.yspeed = this.puck_speed * -1;
                }
            }
        }
        return (this.speed);
    }

// end bracket of the Puck class
}