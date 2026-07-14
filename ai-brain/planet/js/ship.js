export default class Ship {
    constructor(three) {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new three.PerspectiveCamera(60, aspect, 0.1, 10000);
        this.camera.position.set(0, 10, 0);
    }
    get actual() {
        return this.camera;
    }
    get position() {
        return this.camera.position;
    }
    setPosition(x, y, z) {

    }
    lookAt(x, y, z) {

    }
}
