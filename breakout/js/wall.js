import Brick from './brick.js';

export default class Wall {
    constructor(three, scene, n) {
        this.bricks = [];
        for ( let i = 1; i <= n; i+=2 ) {
            const b = new Brick(three, -i, i, 2, 1);
            b.addToScene(scene);
            this.bricks.push(b);
        }
    }
}
