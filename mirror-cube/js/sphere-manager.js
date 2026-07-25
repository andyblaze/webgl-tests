import Sphere from "./sphere.js";

export default class SphereManager {
    constructor(three) {
        this.sphereRadius = 0.125;
        this.sphereCount = 60;
        this.spheres = [];

        this.activeSphereIndices = [];

        for (let i = 0; i < 10; i++) {
            this.activeSphereIndices.push(i);
        }

        this.sphereGeometry = new three.SphereGeometry(this.sphereRadius, 32, 32);
        this.sphereMaterial = new three.MeshStandardMaterial({
            color: 0xff2244,
            roughness: 0.25,
            metalness: 0.1
        });        
    }
    createSpheres(three, cfg, scene) {
        const exclusionRadius = cfg.cubeRadius + this.sphereRadius + 0.25;

        for ( let i = 0; i < this.sphereCount; i++ ) {
            const pos = this.getPosition(three, cfg.cubeCentre, exclusionRadius);
            const sphere = new Sphere(three, pos, cfg.cubeCentre);

            scene.add(sphere.mesh);        

            this.spheres.push(sphere);
        }
    }
    getPosition(three, cubeCentre, exclusionRadius) {
        const p = new three.Vector3();
        do {
            p.set(
                three.MathUtils.randFloat(-6, 6),
                three.MathUtils.randFloat(-3, 3),
                three.MathUtils.randFloat(-2, -10)
            );
        } while (
            p.distanceTo(cubeCentre) < exclusionRadius
        );
        return p;
    }
update(elapsed) {
    this.activeSphereIndices.forEach((index) => {
        const sphere = this.spheres[index];

        const t = elapsed * 0.5 + index;
        const p = Math.sin(t) * 0.002;

        sphere.update(p);
    });
}
}