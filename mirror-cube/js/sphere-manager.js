import Sphere from "./sphere.js";
import { randomFrom, mt_randf } from "./functions.js";

export default class SphereManager {
    constructor(three) {
        this.sphereRadius = 0.125;
        this.sphereCount = 90;
        this.spheres = [];
        this.activeGroups = [
            [],
            [],
            []
        ];

        this.activeGroupIndex = 0;
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
        this.activeGroups[0] = this.spheres.slice(0, 30);
        this.activeGroups[1] = this.spheres.slice(30, 60);
        this.activeGroups[2] = this.spheres.slice(60, 90);
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
        this.activeSpheres = [];
        for (let i = 0; i < n; i++) {
            const item = randomFrom(this.spheres);
            this.activeSpheres.push(item);
        }
    }
    update(elapsed) {
        if ( elapsed >= this.nextTrigger ) {
            const group = this.activeGroups[this.activeGroupIndex];
            for ( const s of group ) 
                s.startOrbit(mt_randf(0.8, 1.2));

            this.activeGroupIndex++;// = 1 - this.activeGroupIndex;
            if ( this.activeGroupIndex > 2 )
                this.activeGroupIndex = 0;

            this.nextTrigger += 3; 
        }
        for ( const s of this.spheres ) 
            s.update();                  
    }
}