export default class Config {
    constructor(three, wnd) {
        this.innerW = wnd.innerWidth;
        this.innerH = wnd.innerHeight;
        this.halfW = this.innerW / 2;
        this.halfH = this.innerH / 2;
        this.aspect = wnd.innerWidth / wnd.innerHeight;
        this.dpr = wnd.devicePixelRatio;
        this.canvasParent = "scene-wrap";
        this.camera = {
            fov: 60,
            near: 0.1,
            far: 100,
            pos: new three.Vector3(0, 0, 10),
            target: new three.Vector3(0, 0, 0)
        };
    }
}
