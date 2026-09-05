export default class ClockFace {
    constructor(three) {
        this.geometry = new three.SphereGeometry(5.8, 64, 32);

        const loader = new three.TextureLoader();
        const texture = loader.load("./textures/marble-normal.png");

        this.material = new three.MeshPhysicalMaterial({
            color: 0xff0000,
            roughness: 0.3,
            metalness: 0.13,
            emissive: 0xff0000,
            emissiveIntensity: 0.4,
            normalMap: texture,
        });

        this.threeObj = new three.Mesh(this.geometry, this.material);

        // Flatten it along Z
        this.threeObj.scale.set(1, 1, 0.25);
        this.threeObj.position.z = -1.6;
    }
    get native() {
        return this.threeObj;
    }
    update(dt, elapsed) {
        this.material.normalMap.offset.x = elapsed * 0.002;
        this.material.normalMap.offset.y = elapsed * 0.005;
    }
}