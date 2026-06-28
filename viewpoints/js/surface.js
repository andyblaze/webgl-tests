export default class Surface {
    constructor(three, rt) {
        this.s = new three.Mesh(
            new three.SphereGeometry(2, 64, 64),
            new three.MeshBasicMaterial({ map: rt.texture })
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
