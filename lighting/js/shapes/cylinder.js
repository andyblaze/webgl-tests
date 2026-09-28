import ThreeObj from "../three/three-obj.js";

export default class Cylinder extends ThreeObj {
    constructor(three, geo, mat) {
        super(three);
        const { radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded } = geo;
        this.geometry = new three.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
        this.radius = radiusBottom;
        this.height = height;
        this.radialSegments = radialSegments;
        this.bendSegments = heightSegments;    
        this.geometryType = three.CylinderGeometry;    
    }
}
