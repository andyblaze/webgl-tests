import ThreeObj from "../three/three-obj.js";

export default class Cone extends ThreeObj {
    constructor(three, geo, mat) {
        super(three);
        const { radius, height, radialSegments, heightSegments, openEnded } = geo;
        this.geometry = new three.ConeGeometry(radius, height, radialSegments, heightSegments, openEnded);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
        //const { radius, height, radialSegments, heightSegments } = geo;
        //this.geometry = new three.ConeGeometry(radius, height, radialSegments, heightSegments);
        //this.material = new three.MeshPhysicalMaterial({ color: 0xffffff });
        this.radius = radius;
        this.height = height;
        this.radialSegments = radialSegments;
        this.bendSegments = heightSegments;
    }
}
