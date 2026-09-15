import ThreeObj from "./three-obj.js";

export default class Cylinder extends ThreeObj {
    constructor(three, topRadius, baseRadius, height, cfg, openEnd=false) {
        super();
        this.geometry = new three.CylinderGeometry(topRadius, baseRadius, height, 32, 32, openEnd);
        this.material = new three.MeshPhysicalMaterial(cfg);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
    doUpdate(dt, elapsed) {
        const { x, y, z } = {x: dt / 3, y: dt / 5, z: dt / 7 };
        this.rotate(x, y, z);
    }
}
