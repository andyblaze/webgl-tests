import ThreeObj from "./three-obj.js";

export default class Box extends ThreeObj {
    constructor(three, cfg) {
        super();
        this.geometry = new three.BoxGeometry(cfg.size, cfg.size, cfg.size);
        this.material = new three.MeshPhysicalMaterial({ color: cfg.color });
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
    update(dt, elapsed) {
        const { x, y, z } = {x: dt / 3, y: dt / 5, z: dt / 7 };
        this.rotate(x, y, z);
    }
}
