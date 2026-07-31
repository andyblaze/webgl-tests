import ThreeObject from "./three-object.js";

export default class Renderer extends ThreeObject {
    constructor(three, cfg) {
        super();
        this.nativeObj = new three.WebGLRenderer({antialias: true});
        this.nativeObj.setSize(cfg.clientW, cfg.clientH);
        cfg.workspace.appendChild(this.nativeObj.domElement);
    }
    render(scene, camera) {
        this.nativeObj.render(scene, camera);
    }
}
