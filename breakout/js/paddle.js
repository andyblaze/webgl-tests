import PaddleRenderer from "./paddle-renderer.js";
import PaddleCollider from "./paddle-collider.js";

export default class Paddle {
    constructor(three, x, y, width, height) {
        this.x = x;
        this.y = y;
        this.speed = 8;

        this.renderer = new PaddleRenderer(three, width, height);
        this.collider = new PaddleCollider(x, y, width, height);
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