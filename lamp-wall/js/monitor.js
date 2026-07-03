export default class Monitor {
    constructor(c, s) {
        this.visible = true;
        this.cam = c;
        this.setCameraPos(0, 0, 0);
        this.lookAt(0, 0, 0);
        this.surface = s;
        this.setSurfacePos(0, 0, 0);
        this.scaleSurface(1, 1, 1);
    }
    setCameraPos(x, y, z) {
        this.cam.setPosition(x, y, z);
        return this;
    }
    lookAt(x, y, z) {
        this.cam.lookAt(x, y, z);
        return this;
    }
    setSurfacePos(x, y, z) {
        this.surface.setPos(x, y, z);
        return this;
    }
    scaleSurface(x, y, z) {
        this.surface.scale(x, y, z);
        return this;
    }
    addToScene(scene) {
        scene.add(this.surface.actual);
        return this;
    }
    toggleVisibility() {
        this.visible = !this.visible;
        this.surface.setVisible(this.visible);
    }
    get camera() {
        return this.cam.actual;
    }
}
