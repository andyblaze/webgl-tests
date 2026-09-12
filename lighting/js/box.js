import ThreeObj from "./three-obj.js";

export default class Box extends ThreeObj {
    constructor(three) {
        super();
        this.geometry = new three.BoxGeometry(3, 3, 3);
        this.material = new three.MeshPhysicalMaterial({ color: 0x00ff00 });
        this.threeObj = new three.Mesh(this.geometry, this.material);
    }
    update(dt, elapsed) {
        const { x, y, z } = {x: dt / 3, y: dt / 5, z: dt / 7 };
        this.rotate(x, y, z);
    }
}
