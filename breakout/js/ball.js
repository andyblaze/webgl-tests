import BallRenderer from './ball-renderer.js';
import BallCollider from './ball-collider.js';

export default class Ball {
    constructor(three, x, y, r) {
        this.x = x;
        this.y = y;
        this.radius = r;

        this.vx = 5;
        this.vy = 3;

        this.renderer = new BallRenderer(three, r);
        this.collider = new BallCollider(r);

        this.renderer.setPosition(this.x, this.y);
    }
    addToScene(scene) {
        this.renderer.addToScene(scene);
    }
    update(deltaTime, bounds) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.renderer.setPosition(this.x, this.y);
    }
}
