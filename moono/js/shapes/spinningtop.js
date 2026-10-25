import ThreeObj from "../three/three-obj.js";

export default class SpinningTop extends ThreeObj {
    constructor(three, geo, mat) {
        super();
        const { radius, height, capSegments, radialSegments, heightSegments } = geo;
        this.geometry = new three.CapsuleGeometry(radius, height, capSegments, radialSegments, heightSegments);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
}
