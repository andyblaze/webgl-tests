export default class BrickRenderer {
    constructor(three, width, height) {
        const geometry = new three.BoxGeometry(width, height, 0.2);
        const material = new three.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new three.Mesh(geometry, material);
    }
    addToScene(scene) {
        scene.add(this.mesh);
    }
    setPosition(x, y) {
        this.mesh.position.set(x, y, 0);
    }
}
