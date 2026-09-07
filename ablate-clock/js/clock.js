import { mt_rand, mt_randf, randomSpeed } from "./functions.js";

export default class Clock {
    constructor(phaser) {
        this.markers = [];
        this.hands = {};
        this.face = null;
        this.elapsed = 0;
        this.speedMultiplier = 1;
        this.phaser = phaser;
    }
    update(dt, elapsed) {
        this.elapsed += dt;
        if ( mt_rand(0, 300) < 1 && this.phaser.isStopped )
            this.phaser.start(randomSpeed(), mt_rand(12, 24));

        this.speedMultiplier = this.phaser.update(dt);

        for ( const [name, hand] of Object.entries(this.hands) )
            hand.update(dt, this.speedMultiplier);
        
        const speed = 0.03 * this.speedMultiplier;
        const value = (1 - Math.cos(this.elapsed * speed)) * 0.5;
        for ( const m of this.markers ) {
            m.material.emissiveIntensity = value;
            m.material.opacity = value * 0.5;
        }

        this.face.update(dt, elapsed);
        
    }
    addFace(f) {
        this.face = f;
    }
    addMarkers(three, scene, cfg) {
        for ( const [id, m] of Object.entries(cfg.markers) ) {
            const mrkr = new three.Mesh(
                new three.BoxGeometry(9.5, 0.1, 0.1),
                new three.MeshPhysicalMaterial({
                    color: 0x0dc4fc,
                    transparent: true,
                    opacity: 0,
                    emissive:0x00ff00, //0dc4fc,
                    emissiveIntensity:0
                })
            );
            mrkr.rotation.copy(m.rotation); 
            mrkr.position.copy(m.position);
            this.markers.push(mrkr);
            scene.add(mrkr);    
        }        
    }
    add(h) {
        this.hands[h.name] = h;
        return this;
    }
}
