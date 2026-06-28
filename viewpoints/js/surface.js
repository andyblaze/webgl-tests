export default class Surface {
    constructor(three, cfg) {
        this.s = new three.Mesh(
            new three.SphereGeometry(cfg.radius, cfg.widthSegs, cfg.heightSegs),
            new three.MeshBasicMaterial({ map: cfg.rt.texture })
        );
    }
    setPos(x, y, z) {
        this.s.position.set(x, y, z);
    }
    scale(x, y, z) {
        this.s.scale.set(x, y, z);
    }
    setVisible(v) {
        this.s.visible = v;
    }
    get actual() {
        return this.s;
    }
}
