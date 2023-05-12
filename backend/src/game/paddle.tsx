
export default class Paddle {
    // var in my class
    x: number;
    y: number;
    xspeed: number;
    yspeed: number;
    w: number;
    h: number;
    width: number;
    height: number;
    ychange: number;
    id: number;
    name: string;

    // constructor
    constructor( width: number, height: number, left: boolean, e: boolean, id: number, name: string) {
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
        this.id = id;
        this.name = name;
        if (left == false)
            console.log("paddle constructor type --> right")
        else
            console.log("paddle constructor type --> false")
        console.log("our player is ", this.id, this.name);
    };

    // fonction
    constrainValue(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
      }

    update() {
        this.y += this.ychange;
        this.y = this.constrainValue(this.y, this.h / 2,  this.height - this.h / 2);
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
}