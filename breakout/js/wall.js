import Brick from './brick.js';

export default class Wall {
    constructor(three, scene, n, brickSz) {
        const left = -((n / 2) * brickSz.width);
        //console.log(left);
        this.bricks = [];
        for ( let x = left; x < n; x+= brickSz.width ) {
            //console.log(x);
            const b = new Brick(three, x, 1, brickSz.width, brickSz.height);
            b.addToScene(scene);
            this.bricks.push(b);
        }
    } 
}
