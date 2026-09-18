import ThreeObj from "../three/three-obj.js";

export default class Plane extends ThreeObj {
    constructor(three, geo, mat) {
        super();
        const { width, height, widthSegments, heightSegments } = geo;
        this.geometry = new three.PlaneGeometry(width, height, widthSegments, heightSegments);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
    doUpdate(dt, elapsed) {
        const { x, y, z } = {x: dt / 3, y: dt / 5, z: dt / 7 };
        this.rotate(x, y, z);
    }
}
