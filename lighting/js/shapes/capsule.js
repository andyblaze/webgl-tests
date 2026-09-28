import ThreeObj from "../three/three-obj.js";

export default class Capsule extends ThreeObj {
    constructor(three, geo, mat) {
        super(three);
        const { radius, height, capSegments, radialSegments, heightSegments } = geo;
        this.geometry = new three.CapsuleGeometry(radius, height, capSegments, radialSegments, heightSegments);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
        this.radius = radius;
        this.height = height;
        this.bendSegments = heightSegments;  
        this.rebuildParams = [radius, height, 64, 64, 128];  
        this.geometryType = three.CapsuleGeometry
    }
}
