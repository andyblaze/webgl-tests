import ThreeObj from "./three-obj.js";

export default class Sphere extends ThreeObj {
    constructor(three, radius, cfg) {
        super();
        this.geometry = new three.SphereGeometry(radius, 32, 32);
        this.material = new three.MeshPhysicalMaterial(cfg);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
    update(dt, elapsed) {
        super.update(dt, elapsed);
        const { x, y, z } = {x: dt / 13, y: dt / 15, z: dt / 17 };
        this.rotate(x, y, z);
    }
}
