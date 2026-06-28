export default class Monitor {
    constructor(c, s) {
        this.visible = true;
        this.cam = c;//new Camera({ fov: 45, aspect: 1, near: 0.1, far: 100 });
        this.setCameraPos(-8,7,-8);
        this.lookAt(0,1,0);
        this.surface = s;//new Surface(rt);
        this.setSurfacePos(-22, 3, -2);
        this.scaleSurface(2.2, 2.2, 2.2);
    }
    setCameraPos(x, y, z) {
        this.cam.setPosition(-8, 7, -8);
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
