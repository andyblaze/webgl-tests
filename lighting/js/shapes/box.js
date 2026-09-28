import ThreeObj from "../three/three-obj.js";

export default class Box extends ThreeObj {
    constructor(three, geo, mat) {
        super(three);
        const { width, height, depth } = geo;
        this.geometry = new three.BoxGeometry(width, height, depth, 16, 64);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
        this.radius = width;
        this.height = height;
        this.radialSegments = 1;
        this.bendSegments = 64;
        this.geometryType = three.BoxGeometry;
    }
}
