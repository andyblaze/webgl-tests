export default class Surface {
    constructor(three, cfg) {
        this.s = new three.Mesh(
            new three.PlaneGeometry(5, 5),
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
