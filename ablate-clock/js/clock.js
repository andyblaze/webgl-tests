import { mt_rand, randomSpeed } from "./functions.js";
import Marker from "./marker.js";

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
        
        for ( const marker of this.markers ) 
            marker.update(dt, this.elapsed);

        this.face.update(dt, elapsed);
        
    }
    addFace(f) {
        this.face = f;
    }
    addMarkers(three, scene, cfg) {
        for ( const [id, m] of Object.entries(cfg.markers) ) {
            const mrkr = new Marker(three);
            mrkr.setRotation(m.rotation); 
            mrkr.setPosition(m.position);
            this.markers.push(mrkr);
            scene.add(mrkr.native);    
        }        
    }
    add(h) {
        this.hands[h.name] = h;
        return this;
    }
}
