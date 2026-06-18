import PaddleRenderer from "./paddle-renderer.js";
import PaddleCollider from "./paddle-collider.js";

export default class Paddle {
    constructor(three, pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.speed = 8;

        this.renderer = new PaddleRenderer(three, pos.width, pos.height);
        this.collider = new PaddleCollider(pos.x, pos.y, pos.width, pos.height);
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