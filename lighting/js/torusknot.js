import ThreeObj from "./three-obj.js";

export default class TorusKnot extends ThreeObj {
    constructor(three, radius, tube, cfg) {
        super();
        this.geometry = new three.TorusKnotGeometry(radius, tube, 100, 16);
        this.material = new three.MeshPhysicalMaterial(cfg);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
    update(dt, elapsed) {
        const { x, y, z } = {x: dt / 3, y: dt / 5, z: dt / 7 };
        this.rotate(x, y, z);
    }
}
