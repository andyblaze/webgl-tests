import Brick from './brick.js';

export default class Wall {
    constructor(three, scene, cols, rows, brickSz) {
        const left = -(cols * brickSz.width) / 2;

        this.bricks = [];

        for ( let row = 0; row < rows; row++ ) {
            const y = 1 + row * brickSz.height;

            for ( let col = 0; col < cols; col++ ) {
                const x = left + col * brickSz.width;

                const brick = new Brick(
                    three,
                    x,
                    y,
                    brickSz.width,
                    brickSz.height
                );

                brick.addToScene(scene);
                this.bricks.push(brick);
            }
        }
    }
}
