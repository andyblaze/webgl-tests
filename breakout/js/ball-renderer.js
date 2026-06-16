export default class BallRenderer {
    constructor(three, radius) {
        const geometry = new three.SphereGeometry(radius, 32, 32);
        const material = new three.MeshBasicMaterial({ color: 0xffffff });
        this.mesh = new three.Mesh(geometry, material);
    }
    setPosition(x, y) {
        this.mesh.position.set(x, y, 0);
    }
    addToScene(scene) {
        scene.add(this.mesh);
    }
}
