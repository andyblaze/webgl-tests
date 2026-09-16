import ThreeObj from "../three/three-obj.js";

export default class Floor extends ThreeObj {
    constructor(three, size, cfg) {
        super();
        this.geometry = new three.PlaneGeometry(size, size);
        this.material = new three.MeshPhysicalMaterial(cfg);
        this.threeObj = new three.Mesh(this.geometry, this.material);
        this.threeObj.rotation.x = Math.PI / 2;
        this.setPosition(0, -5, -10.5);
    }
}
