import ThreeObj from "../three/three-obj.js";

export default class Box extends ThreeObj {
    constructor(three, geo, mat) {
        super();
        const { width, height, depth } = geo;
        this.geometry = new three.BoxGeometry(width, height, depth);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
}
