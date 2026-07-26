import Sphere from "./sphere.js";
import { mt_rand } from "./functions.js";

export default class SphereManager {
    constructor(three) {
        this.sphereRadius = 0.125;
        this.sphereCount = 60;
        this.spheres = [];
        this.activeSphereIndices = [];
        this.nextTrigger = 3;

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
    getSpheres(n) {
        this.activeSphereIndices = [];
        for (let i = 0; i < n; i++) {
            const idx = mt_rand(0, this.spheres.length - 1);
            this.activeSphereIndices.push(idx);
        }
    }
    update(elapsed) {
        if ( elapsed >= this.nextTrigger ) {
            this.getSpheres(10);
            this.activeSphereIndices.forEach((index) => {
                const sphere = this.spheres[index];
                sphere.startOrbit(0.262);
            }); 
            this.nextTrigger += 3; 
        }
        for ( const s of this.spheres ) 
            s.update();                  
    }
}