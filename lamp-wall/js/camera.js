export default class Camera {
    constructor(three, cfg) {
        this.c = new three.PerspectiveCamera(cfg.fov, cfg.aspect, cfg.near, cfg.far);
    }
    setPosition(x, y, z) {
        this.c.position.set(x, y, z);
    }
    lookAt(x, y, z) {
        this.c.lookAt(x, y, z);
    }
    get actual() {
        return this.c;
    }
}
