import ThreeObj from "../three/three-obj.js";

export default class Octahedron extends ThreeObj {
    constructor(three, radius, cfg, detail=0) {
        super();
        this.geometry = new three.OctahedronGeometry(radius, detail);
        this.material = new three.MeshPhysicalMaterial(cfg);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
    doUpdate(dt, elapsed) {
        const { x, y, z } = {x: dt / 3, y: dt / 5, z: dt / 7 };
        this.rotate(x, y, z);
    }
}
