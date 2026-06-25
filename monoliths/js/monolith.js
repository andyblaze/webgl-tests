export default class Monolith {
    constructor(three, cfg) {
        this.cfg = {...cfg};
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
        this.glyphs.create(this.cfg);
    }
    render(three, scene) {
        this.glyphs.render(three, scene, this.cfg);
    }
    update(dt) {
        this.glyphs.update(dt);
    }
    addToScene(scene) {
        scene.add(this.lith);
    }
}
