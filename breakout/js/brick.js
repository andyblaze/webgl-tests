import BrickRenderer from "./brick-renderer.js";
import BrickCollider from "./brick-collider.js";

export default class Brick {
    constructor(three, x, y, width, height) {
        this.x = x;
        this.y = y;
        this.destroyed = false;

        this.renderer = new BrickRenderer(three, width, height);
        this.collider = new BrickCollider(x, y, width, height);
        this.renderer.setPosition(this.x, this.y);
    }
    addToScene(scene) {
        this.renderer.addToScene(scene);
    }
    destroy() {
        this.destroyed = true;
        this.renderer.update(this);
    }
}
