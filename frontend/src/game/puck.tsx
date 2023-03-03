import { P5CanvasInstance } from 'react-p5-wrapper';
import Paddle from './paddle';






/*
import useSound from 'use-sound';

import dynamic from 'next/dynamic';

import "react-p5-wrapper/node_modules/p5/lib/addons/p5.dom";
import p5 from "p5"; 
(window as any).p5 = p5;
const sound = dynamic(import("p5/lib/addons/p5.sound"));
const load = async () => {
    await import("p5/lib/addons/p5.sound");
};

(async () => { await import("p5/lib/addons/p5.sound"); // Make sure you have used await inside an asynchronous function
// ....
})();
*/

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
        //this.angle = 0;
        this.xspeed = 10 * this.p.cos(this.angle);
        this.yspeed = 10 * this.p.sin(this.angle);
    };

    // function 

    // reset when it's quit the canvas window
    reset() {
        this.x = this.width / 2;
        this.y = this.height / 2;
        this.angle = this.p.random(-this.p.PI / 4, this.p.PI / 4);
        this.xspeed = 10 * this.p.cos(this.angle);
        this.yspeed = 10 * this.p.sin(this.angle);

        if (this.p.random(1) < 0.5)
            this.xspeed *= -1;
    }

    update() {
        this.x = this.x + this.xspeed;
        this.y = this.y + this.yspeed;
    }

    // move the puck
    edges(left_score: number, right_score: number) : [left_score: number, right_score:number] {
    
        //const [play] = useSound("./sound/win.mp3");
        //let ding = this.p.loadSound("./sound/win.mp3");
        
        //let song = this.p.loadSound("./assets/hurry.mp3");
        //let ding = new this.p.SoundFile(this.p.url("./sound/win.mp3"));
        //const ding = this.p.loadSound(("./sound/win.mp3"));
        // here for sound
        
        if (this.y < 0 || this.y > this.height) {
            this.yspeed *= -1;
        }
        if (this.x - this.r > this.width)
        {
            //play;
            //ding.play();
            left_score++;
            this.reset();
        }
        if (this.x + this.r < 0)
        {
            //play;
            //ding.play()
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
        if (this.y < p.y + p.h / 2 && this.y > p.y - p.h / 2 && this.x - this.r < p.x + p.w / 2) {
            if (this.x > p.x)
            {
                let diff : number = this.y - (p.y - p.h / 2);
                let rad : number = this.p.radians(45);
                let angle : number = this.p.map(diff, 0, p.h, -rad, rad);
                this.xspeed = 10 * this.p.cos(angle);
                this.yspeed = 10 * this.p.sin(angle);
                this.x = p.x + p.w / 2;
            }
        }
    }
    
    checkPaddleRight(p: Paddle)
    {
        if (this.y < p.y + p.h / 2 && this.y > p.y - p.h / 2 && this.x + this.r > p.x - p.w / 2) {
            if (this.x < p.x)
            {
                let diff : number = this.y - (p.y - p.h / 2);
                let rad : number = this.p.radians(135);
                let angle : number = this.p.map(diff, 0, p.h, -rad, rad);
                this.xspeed = 10 * this.p.cos(angle);
                this.yspeed = 10 * this.p.sin(angle);
                this.x = p.x - p.w / 2;

            }
        }
    }

// end bracket of the Puck class
}