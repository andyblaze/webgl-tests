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
        this.bendSegments = heightSegments;  
        this.rebuildParams = [radiusTop, radiusBottom, height, 32, 64, openEnded];  
        this.geometryType = three.CylinderGeometry;    
    }
}
