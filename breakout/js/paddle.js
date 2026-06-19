import PaddleRenderer from "./paddle-renderer.js";
import PaddleCollider from "./paddle-collider.js";

export default class Paddle {
    constructor(three, cfg) {
        this.x = cfg.x;
        this.y = cfg.y;
        this.speed = cfg.speed;
        this.maxAngleFactor = cfg.maxAngleFactor;

        this.renderer = new PaddleRenderer(three, cfg.width, cfg.height);
        this.collider = new PaddleCollider(cfg.x, cfg.y, cfg.width, cfg.height);
        this.renderer.setPosition(this.x, this.y);
    }
    addToScene(scene) {
        this.renderer.addToScene(scene);
    }
    update(deltaTime, input, bounds) {
        if ( input.left ) {
            this.x -= this.speed * deltaTime;
        }
        if ( input.right ) {
            this.x += this.speed * deltaTime;
        }
        const halfWidth = this.collider.width / 2;

        if ( this.x - halfWidth < bounds.left ) {
            this.x = bounds.left + halfWidth;
        }
        if ( this.x + halfWidth > bounds.right ) {
            this.x = bounds.right - halfWidth;
        }
        this.collider.x = this.x;
        this.collider.y = this.y;
        this.renderer.setPosition(this.x, this.y);
    }
}