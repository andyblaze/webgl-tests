import BallRenderer from './ball-renderer.js';
import BallCollider from './ball-collider.js';

export default class Ball {
    constructor(three, cfg) {
        this.x = cfg.x;
        this.y = cfg.y;
        this.startX = cfg.x;
        this.startY = cfg.y;
        this.radius = cfg.radius;

        this.vx = cfg.vx;
        this.vy = cfg.vy;
        this.startVx = cfg.vx;
        this.startVy = cfg.vy;

        this.dead = false;

        this.renderer = new BallRenderer(three, cfg.radius);
        this.collider = new BallCollider(cfg.radius);

        this.renderer.setPosition(this.x, this.y);
    }
    addToScene(scene) {
        this.renderer.addToScene(scene);
    }
    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.renderer.setPosition(this.x, this.y);
    }
    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.vx = this.startVx;
        this.vy = this.startVy;
        this.dead = false;
        this.renderer.setPosition(this.x, this.y);
    }
    kill() {
        this.dead = true;
    }
}
