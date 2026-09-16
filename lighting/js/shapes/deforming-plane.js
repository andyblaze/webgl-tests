import ThreeObj from "../three/three-obj.js";

export default class DeformingPlane extends ThreeObj {

    constructor(three, size, segments, cfg = {}) {
        super();
        this.geometry = new three.PlaneGeometry(size, size, segments, segments);
        this.material = new three.MeshPhysicalMaterial(cfg);

        this.threeObj = new three.Mesh(this.geometry, this.material);
        this.threeObj.rotation.x = Math.PI / 2;
        this.setPosition(0, -5, 0);

        this.positions = this.geometry.attributes.position;
    }
    update(timestamp, field) {
        // deformation goes here

        this.positions.needsUpdate = true;
    }
}
