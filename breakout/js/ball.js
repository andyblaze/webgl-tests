import BallRenderer from './ball-renderer.js';
import BallCollider from './ball-collider.js';

export default class Ball {
    constructor(three, pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.radius = pos.radius;

        this.vx = 5;
        this.vy = 3;

        this.renderer = new BallRenderer(three, pos.radius);
        this.collider = new BallCollider(pos.radius);

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
