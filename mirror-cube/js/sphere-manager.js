import Sphere from "./sphere.js";
import { randomFrom, mt_randf, mt_rand } from "./functions.js";

export default class SphereManager {
    constructor(three, cfg) {
        this.sphereCount = cfg.sphereCount;
        this.numGroups = cfg.groupSize;
        this.spheres = [];
        this.activeGroups = Array.from(
            { length: this.numGroups },
            () => []
        );

        this.activeGroupIndex = 0;
        this.nextTrigger = 3;

        this.sphereGeometry = new three.SphereGeometry(cfg.sphereRadius, 32, 32);
        this.sphereMaterial = new three.MeshStandardMaterial({
            color: 0xff2244,
            roughness: 0.25,
            metalness: 0.1
        });        
    }
    createGroups() {
        const grpSize = this.sphereCount / this.numGroups;
        for ( let i = 0; i < this.numGroups; i++ )
            this.activeGroups[i] = this.spheres.slice(grpSize * i, grpSize * (i+1));
    }
    createSpheres(three, cfg, scene) {
        const exclusionRadius = cfg.cubeRadius + cfg.sphereRadius + 0.25;

        for ( let i = 0; i < this.sphereCount; i++ ) {
            const pos = this.getPosition(three, cfg.cubeCentre, exclusionRadius);
            const sphere = new Sphere(three, pos, cfg);

            scene.add(sphere.mesh);        

            this.spheres.push(sphere);
        }
        this.createGroups();
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
    getGroup() {
        this.activeGroupIndex++;
        if ( this.activeGroupIndex > this.activeGroups.length - 1 )
            this.activeGroupIndex = 0;
        return this.activeGroups[this.activeGroupIndex];
    }
    update(elapsed, cfg) {
        if ( elapsed >= this.nextTrigger ) {
            const group = this.getGroup();
            for ( const s of group ) 
                s.startOrbit(mt_randf(cfg.minArc, cfg.maxArc));

            this.nextTrigger += mt_rand(4, 6); 
        }
        for ( const s of this.spheres ) 
            s.update();                  
    }
}