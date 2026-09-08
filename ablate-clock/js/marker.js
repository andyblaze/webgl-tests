export default class Marker {
    constructor(three) {
        this.threeObj = new three.Mesh(
            new three.BoxGeometry(9.5, 0.1, 0.1),
            new three.MeshPhysicalMaterial({
                color: 0x0dc4fc,
                transparent: true,
                opacity: 0,
                emissive:0x00ff00, //0dc4fc,
                emissiveIntensity:0
            })
        );
        this.speed = 0.03;
    }
    get native() {
        return this.threeObj;
    }
    update(dt, elapsed) {
        const value = (1 - Math.cos(elapsed * this.speed)) * 0.5;
        this.threeObj.material.emissiveIntensity = value * 0.75;
        this.threeObj.material.opacity = value * 0.5;
    }
    setRotation(r) {
        this.threeObj.rotation.copy(r);
    }
    setPosition(p) {
        this.threeObj.position.copy(p);
    }
}
