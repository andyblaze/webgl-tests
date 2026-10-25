import ThreeObj from "../three/three-obj.js";

export default class Torus extends ThreeObj {
    constructor(three, geo, mat) {
        super();
        const { radius, tube, radialSegments, tubularSegments } = geo;
        this.geometry = new three.TorusGeometry(radius, tube, radialSegments, tubularSegments);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
}
