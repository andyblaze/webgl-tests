import ThreeObject from "./three-object.js";

export default class Camera extends ThreeObject {
    constructor(three, fov, aspect, near, far) {
        super();
        this.nativeObj = new three.PerspectiveCamera(fov, aspect, near, far);
        this.nativeObj.position.set(0, 0, 15);
    }
}
