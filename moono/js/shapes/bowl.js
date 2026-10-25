import ThreeObj from "../three/three-obj.js";

export default class Bowl extends ThreeObj {
    constructor(three, geo, mat) {
        super();
        const { 
            radius, widthSegments, heightSegments, 
            phiStart, phiLength, thetaStart, thetaLength
        } = geo;
        this.geometry = new three.SphereGeometry(
            radius, widthSegments, heightSegments, 
            phiStart, phiLength, thetaStart, thetaLength
        );
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
}
