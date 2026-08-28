import MoveableGroup from "./moveable-group.js";
import { ROT90 } from "./consts.js";

export default class Hand extends MoveableGroup {

    constructor(three, name, cfg) {
        super(three);
        const data = cfg.hands[name].data;
        Object.assign(this, data);
        this.material = cfg.brushedBrass;
        this.velocity = 0;
        this.direction = 0;
        this.build(three);
    }

    build(three) {
        const geometry = new three.BoxGeometry(
            this.handLength,
            this.handThickness,
            this.handWidth
        ); 

        const hand = new three.Mesh(
            geometry,
            new three.MeshStandardMaterial(this.material)
        );
        hand.position.x = (this.handLength / 2) * this.counterWeight;

        this.addToGroup(hand);
        this.setRotation(ROT90, 0, 0);
    }

    update(dt) {
        this.group.rotation.y += (this.velocity * this.direction) * dt;
    }
}
