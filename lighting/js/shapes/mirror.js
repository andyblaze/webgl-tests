import ThreeGroup from "../three/three-group.js";
import { Reflector } from "../examples/jsm/controls/Reflector.js";

export default class Mirror extends ThreeGroup {
    constructor(three, geo, mat) {
        super(three);
        const { width, height, texW, texH } = geo;
        /*this.geometry = new three.BoxGeometry(width, height, depth);
        this.material = new three.MeshPhysicalMaterial(mat);
        this.threeObj = new three.Mesh(this.geometry, this.material);*/
        this.geometry = new three.PlaneGeometry(width, height);
        const mirror = new Reflector(this.geometry, {
            clipBias: 0.003,
            textureWidth: texW,
            textureHeight: texH,
            color: mat.color
        });
        this.threeObj.add(mirror);
    }
}
