import ThreeObj from "../three/three-obj.js";

export default class Dodecahedron extends ThreeObj {
    constructor(three, geo, mat) {
        super();
        const { radius, detail } = geo;
        this.geometry = new three.DodecahedronGeometry(radius, detail);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
}
