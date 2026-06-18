export default class RendererBase {
    constructor() {
        
    }
    addToScene(scene) {
        scene.add(this.mesh);
    }
    setPosition(x, y) {
        this.mesh.position.set(x, y, 0);
    }
}
