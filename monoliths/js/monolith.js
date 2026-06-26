export default class Monolith {
    constructor(three, cfg) {
        this.glyphs = null;
        this.cfg = {...cfg};
        this.mesh = new three.Mesh(
            new three.BoxGeometry(cfg.width, cfg.height, cfg.depth),
            new three.MeshStandardMaterial({
                color: 0x000024
            })
        );
        this.mesh.position.y = cfg.posY;
    }
    build(three, glyphs) {
        this.glyphs = glyphs;
        this.glyphs.initialise(this.cfg.width, this.cfg.height);
        const glyphsMesh = this.glyphs.build(three);
        glyphsMesh.position.set(0, 0, this.cfg.depth / 2 + 0.01);
        this.mesh.add(glyphsMesh);
    }
    update(dt) {
        this.glyphs.update(dt);
    }
    addToScene(scene) {
        scene.add(this.mesh);
    }
}
