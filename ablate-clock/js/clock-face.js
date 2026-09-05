export default class ClockFace {
    constructor(three) {
        this.geometry = new three.SphereGeometry(5.8, 64, 32);

        this.material = new three.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.3,
            metalness: 0.13
        });

        this.threeObj = new three.Mesh(this.geometry, this.material);

        // Flatten it along Z
        this.threeObj.scale.set(1, 1, 0.25);
        this.threeObj.position.z = -1.6;
    }
    get native() {
        return this.threeObj;
    }
    update(dt) {

    }
}