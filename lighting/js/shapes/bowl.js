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
    doUpdate(dt, elapsed) {
        const { x, y, z } = {x: dt / 13, y: dt / 15, z: dt / 17 };
        this.rotate(x, y, z);
    }
}
