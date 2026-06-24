export default class Monolith {
    constructor(three, cfg) {
        this.cfg = {...cfg};
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.lith = new three.Mesh(
            new three.BoxGeometry(cfg.width, cfg.height, cfg.depth),
            new three.MeshStandardMaterial({
                color: 0x000024
            })
        );
        this.lith.position.y = cfg.posY;
    }
    addGlyphs(g) {
        this.glyphs = g;
        this.glyphs.create(this.canvas, this.ctx);
    }
    render(three, scene) {
        this.glyphs.render(three, scene, this.canvas, this.cfg);
    }
    update(dt) {
        this.glyphs.update(dt, this.canvas, this.ctx);
    }
    addToScene(scene) {
        scene.add(this.lith);
    }
}
