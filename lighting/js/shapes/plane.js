import ThreeObj from "../three/three-obj.js";

export default class Plane extends ThreeObj {
    constructor(three, geo, mat) {
        super();
        const { width, height, widthSegments, heightSegments } = geo;
        this.geometry = new three.PlaneGeometry(width, height, widthSegments, heightSegments);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
}
