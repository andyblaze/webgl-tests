import Brick from './brick.js';

export default class Wall {
    constructor(three, scene, cfg) {
        const { cols, rows, brickW, brickH } = { ...cfg };
        const left = -(cols * brickW) / 2 + brickW / 2;
        this.bricks = [];

        for ( let row = 0; row < rows; row++ ) {
            const py = 1 + row * brickH;

            for ( let col = 0; col < cols; col++ ) {
                const px = left + col * brickW;

                const brick = new Brick(three, { x: px, y: py, width: brickW, height: brickH });

                brick.addToScene(scene);
                this.bricks.push(brick);
            }
        }
    }
}
