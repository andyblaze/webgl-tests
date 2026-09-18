import ThreeObj from "../three/three-obj.js";

export default class Sphere extends ThreeObj {
    constructor(three, geo, mat) {
        super();
        const { radius, widthSegments, heightSegments } = geo;
        this.geometry = new three.SphereGeometry(radius, widthSegments, heightSegments);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
}
