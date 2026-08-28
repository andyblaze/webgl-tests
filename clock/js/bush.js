import MoveableGroup from "./moveable-group.js";
import { ROT90 } from "./consts.js";

export default class Bush extends MoveableGroup {
    constructor(three, name, cfg) {
        super(three);
        const data = cfg.bushes[name].data;
        Object.assign(this, data);
        this.material = cfg.brushedBrass;
        this.velocity = 0;
        this.direction = 0;
        this.build(three);
    }
    build(three) {
        this.buildHub(three);
    }
    update(dt) { 
        this.group.rotation.y += (this.velocity * this.direction) * dt;   
    }
    buildHub(three) {
        const bushGeometry = new three.CylinderGeometry(
            this.bushRadius, this.bushRadius, 
            this.bushThickness, 64
        );
        this.addToGroup(new three.Mesh(
            bushGeometry, 
            new three.MeshStandardMaterial(this.material)
        ));   
        this.setRotation(ROT90, 0, 0);
    }
}
