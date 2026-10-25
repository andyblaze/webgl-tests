import ThreeObj from "../three/three-obj.js";

export default class DeformingPlane extends ThreeObj {

    constructor(three, size, segments, cfg = {}) {
        super();
        this.geometry = new three.PlaneGeometry(size, size, segments, segments);
        this.material = new three.MeshPhysicalMaterial(cfg);
        this.threeObj = new three.Mesh(this.geometry, this.material);
        this.positions = this.geometry.attributes.position;
    }
}
